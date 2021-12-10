import {
	server,
	user,
	stream as streamApi,
	danmaku as danmakuApi
} from "@front/api";
import { event } from "@front/util_function/eventBus";
import { danmakuHandler } from "./danmaku/danmaku";
import { isElectron } from "../util_function/electron";
import { backendRestart } from "../util_function/system";
import { read } from "@front/api/robot";
import { getUserInfo } from "@front/components/danmakuFlow/utils/getter";
import { isOnline } from "@front/api/server";
import {
	isOwner,
	isNormalDanmaku
} from "@front/components/danmakuFlow/utils/tester";
import { addChangedDanmaku } from "@front/util_function/storeWorker/index";
let streamStatusTimer: any = null;

let retry = 0;
export const actions = {
	startServe(store: any) {
		clearTimeout(streamStatusTimer);
		return new Promise((resolve, reject) => {
			if (!isOnline() || store.state.streamStatus.step !== "online") {
				const timer = setTimeout(() => {
					streamStatusTimer = setTimeout(() => {
						const step = store.state.streamStatus.step;
						store.dispatch(
							step === "offline" ? "startServe" : step
						);
					}, 1000);
					reject(new Error("connection failed"));
				}, 10000);
				server.init({
					onOpen: () => {
						clearTimeout(timer);
						if (store.state.streamStatus.step !== "reconnect") {
							store.state.streamStatus.step = "online";
						}
						event.emit("streamStatusChanged");
						resolve(true);
					},
					onClose: () => {
						if (store.state.streamStatus.step !== "reconnect") {
							sessionStorage.setItem(
								"preStep",
								store.state.streamStatus.step
							);
							if (store.state.roomProfile.liveID) {
								sessionStorage.setItem(
									"liveID",
									store.state.roomProfile.liveID
								);
							}
						}
						store.commit("stopLiveDurationTimer");
						store.commit("stopGiftTimer");

						store.state.streamStatus.step = "reconnect";
						event.emit("streamStatusChanged");
						store.dispatch(store.state.streamStatus.step);
					}
				});
			} else {
				resolve(true);
			}
		});
	},
	online(store: any) {
		clearTimeout(streamStatusTimer);
		streamStatusTimer = setTimeout(() => {
			store.dispatch(store.state.streamStatus.step);
		}, 1000);
	},
	login(store: any, userData: any) {
		return new Promise((resolve, reject) => {
			user.login(userData)
				.then(res => {
					store.state.userData = userData;
					store.state.userSession = {
						...res.tokenInfo
						// userID: 378269
					};
					store.state.streamStatus.step = "streamable";
					event.emit("streamStatusChanged");
					store.dispatch(store.state.streamStatus.step);
					resolve(res);
				})
				.catch(err => {
					console.error(err);
					reject(err);
				});
		});
	},
	nostreamable(store: any) {
		clearTimeout(streamStatusTimer);
		return new Promise((resolve, reject) => {
			streamApi
				.validate()
				.then(res => {
					if (res.liveAuth) {
						store.state.streamStatus.step = "streamable";
						event.emit("streamStatusChanged");
						store.dispatch(store.state.streamStatus.step);
					} else {
						streamStatusTimer = setTimeout(() => {
							store.dispatch(store.state.streamStatus.step);
						}, 1000);
					}
					resolve(res.liveAuth);
				})
				.catch(error => {
					console.error(error);
					streamStatusTimer = setTimeout(() => {
						store.dispatch(store.state.streamStatus.step);
					}, 1000);
				});
		});
	},
	streamable(store: any) {
		clearTimeout(streamStatusTimer);
		const state = store.state;
		return new Promise((resolve, reject) => {
			user.checkIsStreaming(state.userSession)
				.then(({ isStreaming, data }) => {
					const liveID = state.roomProfile.liveID;
					Object.assign(state.userProfile, data.profile);
					delete data.profile;
					Object.assign(state.roomProfile, data);
					if (isStreaming) {
						state.streamStatus.step = "streaming";
						event.emit("streamStatusChanged");
						store.dispatch(store.state.streamStatus.step);
						resolve(data);
					} else if (liveID) {
						state.streamStatus.step = "streamEnded";
						event.emit("streamStatusChanged");
						resolve(data);
					} else {
						reject(new Error("no streaming"));
					}
				})
				.catch(err => {
					// console.error(err);
					streamStatusTimer = setTimeout(() => {
						store.dispatch(store.state.streamStatus.step);
					}, 1000);
					reject(err);
				});
		});
	},
	streaming(store: any) {
		clearTimeout(streamStatusTimer);
		const state = store.state;
		const filter = state.filter;
		return new Promise((resolve, reject) => {
			if (
				sessionStorage.getItem("liveID") !==
				String(store.state.roomProfile.liveID)
			) {
				state.danmakuSession.rawFlow = [];
				state.danmakuSession.filterFlow = [];
			}
			const danmakuCallback = (danmaku: any) => {
				if (isNormalDanmaku(danmaku)) {
					const settings: any = isElectron()
						? state.danmakuProfile.toolBox
						: state.danmakuProfile.web;
					const commonSettings =
						state.danmakuProfile.common || danmaku.commonSettings();
					const rank = state.rank;

					// auto click
					if (
						state.danmakuProfile.common.blackList.find(
							(user: any) =>
								user.userID === getUserInfo(danmaku).userID
						)
					) {
						store.commit("kickOut", getUserInfo(danmaku).userID);
						return;
					}

					const { filtered, list, hasCombined } = filter.filterUpdate(
						[danmaku],
						state.danmakuSession.filterFlow,
						settings,
						commonSettings,
						rank
					);
					if (filtered[0]) {
						// chicken robot
						do {
							if (!isElectron()) break;
							const enable = settings?.robotSetting?.enable;
							let shouldRead = false;
							if (!enable) break;
							if (enable === true) {
								shouldRead = true;
							} else if (
								Array.isArray(enable) &&
								enable.includes(danmaku.type)
							) {
								shouldRead = true;
							}
							if (!shouldRead) break;
							const {
								rules,
								ignoreOwner
							} = settings.robotSetting;
							if (!(ignoreOwner && isOwner(danmaku, state))) {
								read({
									...settings.robotSetting,
									rules: rules[danmaku.type],
									danmaku: filtered[0],
									filters: [state.temp.emojiTester]
								});
							}
						} while (false);
						danmaku = filtered[0];
					} else if (!hasCombined) {
						return;
					}
					state.danmakuSession.filterFlow = list;
					addChangedDanmaku(danmaku);
				}

				const handler = danmakuHandler[String(danmaku.type)];
				if (handler) {
					handler(danmaku, store);
				}
			};
			const startCallback = (res: any) => {
				if (store.state.roomProfile.liveID) {
					sessionStorage.setItem(
						"liveID",
						store.state.roomProfile.liveID
					);
				}
				if (res) {
					Object.assign(state.roomProfile, res.StreamInfo);
				}
				store.commit("startLiveDurationTimer");
				store.commit("startGiftTimer");
				state.streamStatus.step = "danmakuing";
				event.emit("streamStatusChanged");
				store.dispatch(store.state.streamStatus.step);
				resolve(true);
			};

			const endCallback = () => {
				user.checkIsStreaming(store.state.userSession)
					.then(res => {
						if (res.isStreaming) {
							store.commit("stopLiveDurationTimer");
							store.commit("stopGiftTimer");
							streamStatusTimer = setTimeout(() => {
								state.streamStatus.step = "streaming";
								store.dispatch(store.state.streamStatus.step);
							}, 1000);
							return;
						}
						state.streamStatus.step = "streamEnded";
						event.emit("streamStatusChanged");
						store.dispatch(store.state.streamStatus.step);
					})
					.catch(e => {
						streamStatusTimer = setTimeout(() => {
							state.streamStatus.step = "streamable";
							store.dispatch(store.state.streamStatus.step);
						}, 1000);
					});
			};
			danmakuApi.startDanmaku(state.userSession, {
				startCallback,
				danmakuCallback,
				endCallback,
				errorCallback: endCallback
			});
		});
	},
	danmakuing(store: any) {
		clearTimeout(streamStatusTimer);
		store.commit("getRank");
		if (isElectron()) {
			store.commit("getRoomProfile");
			store.commit("checkLikeStreaming");
		}
		streamStatusTimer = setTimeout(() => {
			store.dispatch(store.state.streamStatus.step);
		}, 10000);
	},
	streamEnded(store: any) {
		clearTimeout(streamStatusTimer);
		store.commit("resetStreamStatus");
		store.state.streamStatus.step = "streamable";
		store.state.minify = false;
		event.emit("streamStatusChanged");
		store.dispatch(store.state.streamStatus.step);
	},
	async reconnect(store: any) {
		clearTimeout(streamStatusTimer);
		try {
			await store.dispatch("startServe");
			const preStage = sessionStorage.getItem("preStep");
			if (preStage !== "online") {
				const res = await user.login(store.state.userData);
				if (isElectron()) {
					store.state.userSession = {
						...res.tokenInfo
						// userID: 378269
					};
				}
			}
			if (preStage === "danmakuing" || preStage === "streaming") {
				store.state.streamStatus.step = "streamable";
			} else {
				store.state.streamStatus.step = preStage;
			}
			event.emit("streamStatusChanged");
			store.dispatch(store.state.streamStatus.step);
			retry = 0;
		} catch (error) {
			retry += 1;
			if (isElectron() && retry >= 5) {
				console.log("restarted!");

				retry = 0;
				try {
					await backendRestart();
				} catch (error) {}
			}

			streamStatusTimer = setTimeout(() => {
				store.dispatch("reconnect");
			}, 1000);
		}
	},
	openStream(store: any, streamStartInfo: any) {
		return new Promise((resolve, reject) => {
			streamApi
				.start(streamStartInfo)
				.then(async res => {
					if (res && res.liveID) {
						await store.dispatch("streamable");
						resolve(true);
						return;
					}
					throw new Error("openStreamError");
				})
				.catch(e => {
					reject(e);
				});
		});
	},
	closeStream(store: any, liveID: string) {
		return new Promise((resolve, reject) => {
			streamApi
				.close(liveID)
				.then(res => {
					resolve(res);
				})
				.catch(e => {
					reject(e);
				});
		});
	}
};
