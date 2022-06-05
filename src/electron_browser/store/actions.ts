import { user, stream as streamApi, danmaku as danmakuApi } from "@front/api";
import { event } from "@front/util_function/eventBus";
import { isElectron } from "../util_function/electron";

let streamStatusTimer: any = null;
let danmakuTimer: any = null;
export const actions = {
	online(store: any) {
		clearTimeout(streamStatusTimer);
		streamStatusTimer = setTimeout(() => {
			store.dispatch(store.state.streamStatus.step);
		}, 1000);
	},
	login(store: any) {
		store.commit("getRoomProfile");
		store.state.streamStatus.step = "streamable";
		event.emit("streamStatusChanged");
		store.dispatch(store.state.streamStatus.step);
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
			user.streamInfo(state.userSession)
				.then(data => {
					const liveID = state.roomProfile.liveID;
					Object.assign(state.userProfile, data.profile);
					delete data.profile;
					Object.assign(state.roomProfile, data);
					if (data.liveID) {
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
	restartDanmaku(store: any) {
		clearTimeout(danmakuTimer);
		store.dispatch("streaming");
	},
	streaming(store: any, danmakuCallback: any) {
		clearTimeout(streamStatusTimer);
		const state = store.state;
		return new Promise((resolve, reject) => {
			if (
				sessionStorage.getItem("liveID") !==
				String(store.state.roomProfile.liveID)
			) {
				state.danmakuSession.rawFlow = [];
				state.danmakuSession.filterFlow = [];
			}

			const countDown = () => {
				clearTimeout(danmakuTimer);
				danmakuTimer = setTimeout(() => {
					store.dispatch("restartDanmaku");
				}, 12 * 1000);
			};

			const onDanmaku = (danmaku: any) => {
				countDown();
				store.commit("addChangedDanmaku", danmaku);
				store.commit("addNewDanmaku", danmaku);
				if (danmakuCallback) {
					try {
						danmakuCallback(danmaku);
					} catch (error) {}
				}
			};
			const onOpen = (res: any) => {
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

			const onClose = () => {
				clearTimeout(danmakuTimer);
				user.streamInfo(store.state.userSession)
					.then(res => {
						if (res.liveID) {
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
			danmakuApi.startDanmaku({
				onOpen,
				onDanmaku,
				onClose
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
		}, 60000);
	},
	streamEnded(store: any) {
		clearTimeout(danmakuTimer);
		clearTimeout(streamStatusTimer);
		store.commit("resetStreamStatus");
		store.state.streamStatus.step = "streamable";
		store.state.minify = false;
		event.emit("streamStatusChanged");
		store.dispatch(store.state.streamStatus.step);
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
		clearTimeout(danmakuTimer);
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
