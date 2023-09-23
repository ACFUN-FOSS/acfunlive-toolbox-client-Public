import { RootState, stateFunc } from "./state";
import store from "./index";
import { event } from "@front/util_function/eventBus";
import { stream as streamData, temp, room as roomData } from "@front/datas";
import { room, stream, common, wsevent, statistic, user } from "@front/api";
import cloneDeep from "lodash/cloneDeep";
import { saveConfig } from "@front/util_function/system";
import { ElMessage } from "element-plus";
import { isElectron } from "../util_function/electron";
import { danmakuHandler, danmakuPreHandler } from "./danmaku/danmaku";
import { read } from "@front/api/robot";
import {
	getUserInfo,
	getGiftValue
} from "@front/components/danmakuFlow/utils/getter";
import {
	isOwner,
	isNormalDanmaku,
	hasGift,
	hasContent
} from "@front/components/danmakuFlow/utils/tester";
export const mutations: any = {
	reset() {
		store.replaceState(stateFunc());
		store.state.streamStatus.step = "online";
		sessionStorage.setItem("preStep", "online");
	},
	getRoomProfile(state: RootState) {
		user.streamInfo(state.userSession).then(res => {
			if (!res) {
				throw new Error("no streamInfo");
			}
			if (res.profile) {
				Object.assign(state.userProfile, res.profile);
				delete res.profile;
				if (res.liveID) {
					Object.assign(state.roomProfile, res);
				}
			}
		});
	},
	setRoomProfile(state: RootState, roomSetInfo: any) {
		room.setProfile(roomSetInfo).then(() => {
			event.emit("roomProfileChanged");
		});
	},

	getRank(state: RootState) {
		room.getRank(state.userSession).then(res => {
			Object.assign(state.rank, res);
			event.emit("rank-updated");
			wsevent.wsEmit(
				"update-manager",
				{ list: state.managerList },
				"client"
			);
		});
	},

	getCategory(state: RootState) {
		common
			.catrgory()
			.then(res => {
				state.roomCategorys = res || [];
			})
			.catch(() => {
				state.roomCategorys = [];
			});
	},

	getStreamSession(state: RootState) {
		stream
			.session()
			.then(res => {
				state.streamSession = res || streamData.session();
			})
			.catch(() => {
				state.streamSession = streamData.session();
			});
	},

	getStreamEncodec(state: RootState) {
		const streamName =
			state.roomProfile.streamName || state.streamSession.streamName;
		if (!streamName) {
			return;
		}
		stream
			.encodec(streamName)
			.then(res => {
				state.streamEncodec = res[0] || streamData.encodec();
			})
			.catch(() => {
				state.streamEncodec = streamData.encodec();
			});
	},

	resetStreamStatus(state: RootState) {
		state.danmakuSession.rawFlow = [];
		state.danmakuSession.filterFlow = [];
		state.streamStatus = streamData.status();
		state.streamEncodec = streamData.encodec();
		state.streamSession = streamData.session();
		state.roomProfile = roomData.profileDetail();
		store.commit("stopLiveDurationTimer");
		store.commit("stopGiftTimer");
		sessionStorage.setItem("preStep", "");
		if (isElectron()) {
			store.commit("getStreamSession");
		}
	},
	startLiveDurationTimer(state: RootState) {
		store.commit("stopLiveDurationTimer");
		state.roomStatus.liveDurationTimer = setInterval(() => {
			state.roomStatus.liveDuration =
				new Date().getTime() - Number(state.roomProfile.liveStartTime);
		}, 1000);
	},
	stopLiveDurationTimer(state: RootState) {
		clearInterval(state.roomStatus.liveDurationTimer);
	},
	startGiftTimer(state: RootState) {
		store.commit("stopGiftTimer");
		state.roomStatus.giftTimer = setInterval(() => {
			store.commit("giftCount");
		}, 10000);
	},
	stopGiftTimer(state: RootState) {
		store.commit("giftCount");
		clearInterval(state.roomStatus.giftTimer);
	},
	giftCount(state: RootState) {
		const { liveID } = state.roomProfile;
		if (!liveID) {
			return;
		}
		statistic.getCurrentStastic({ liveID }).then((res: any) => {
			Object.assign(state.roomStatus.statistic, res);
		});
	},
	updateStyle(state: RootState, { styleType, style }: any) {
		if (styleType && style) {
			// @ts-ignore
			state.danmakuProfile[styleType].settingOfType = cloneDeep(style);
		}
		saveConfig(state.danmakuProfile);
		setTimeout(() => {
			wsevent.wsEmit("update-style", {}, "danmakuWeb");
		}, 500);
	},
	updateSettings(state: RootState, { settingType, setting }: any) {
		if (settingType && setting) {
			// @ts-ignore
			state.danmakuProfile[settingType] = cloneDeep(setting);
		}
		state.temp = temp.tempInfo();
		saveConfig(state.danmakuProfile);
	},
	getManagerList(state: RootState) {
		room.getManagerList().then((res: any) => {
			if (res) state.managerList = res;
		});
	},
	addManager(state: RootState, uid: number) {
		room.addManager(uid).then(() => store.commit("getManagerList"));
	},
	removeManager(state: RootState, uid: number) {
		room.removeManager(uid).then(() => store.commit("getManagerList"));
	},
	kickOut(state: RootState, uid: number) {
		room.kickOutPerson({
			userID: uid,
			liveID: state.roomProfile.liveID
		});
	},
	addBlackList(state: RootState, userProfile: any) {
		const common = state.danmakuProfile.common;
		if (common.blackList.find(i => i.userID === userProfile.userID)) {
			return;
		}
		common.blackList = [userProfile, ...common.blackList];
		store.commit("kickOut", userProfile.userID);
		store.commit("updateSettings", {});
	},
	removeBlackList(state: RootState, userProfile: any) {
		const common = state.danmakuProfile.common;

		common.blackList = common.blackList.filter(
			i => i.userID !== userProfile.userID
		);
		store.commit("updateSettings", {});
	},
	addLikeList(state: RootState, userProfile: any) {
		const common = state.danmakuProfile.common;
		if (!common.likeList) common.likeList = [];
		if (common.likeList.find(i => i.userID === userProfile.userID)) {
			return;
		}
		common.likeList = [userProfile, ...common.likeList];
		store.commit("updateSettings", {});
	},
	removeLikeList(state: RootState, userProfile: any) {
		const common = state.danmakuProfile.common;
		if (!common.likeList) return;
		common.likeList = common.likeList.filter(
			i => i.userID !== userProfile.userID
		);
		store.commit("updateSettings", {});
	},
	checkLikeStreaming(state: RootState) {
		const tempLike = state.temp.likeList;
		// const likeList = state.danmakuProfile.common.likeList;
		const likeList: any = [];
		if (!likeList || !likeList.length) {
			return;
		}
		const requestList: any = [];
		likeList.forEach((like: any) => {
			requestList.push(
				user.isStreaming({
					userID: like.userID
				})
			);
		});
		Promise.allSettled(requestList).then((res: any) => {
			res.forEach((info: any) => {
				info = info.value;
				if (!info.userID) {
					return;
				}
				try {
					const id = info.userID;
					const nickname = info.nickname;
					const isLiving = Boolean(info.liveID);
					let needMention = false;
					if (tempLike[id]) {
						needMention = tempLike[id].isLive !== isLiving;
						tempLike[id].isLive = isLiving;
					} else {
						needMention = isLiving;
						tempLike[id] = {
							...temp.likeTemp(),
							isLive: isLiving
						};
					}
					if (needMention) {
						ElMessage({
							message: isLiving
								? `恁关注的${nickname} 开播啦，<a href="https://live.acfun.cn/live/${id}" target='_blank'>点此查看</a>`
								: `${nickname} 下播啦！`,
							dangerouslyUseHTMLString: true,
							duration: 5000,
							offset: 160,
							type: "success"
						});
					}
				} catch (error) {}
			});
		});
	},
	addKeyword(state: RootState, keyword: string) {
		if (!(keyword = keyword.trim())) {
			return;
		}
		const common = state.danmakuProfile.common;
		keyword =
			keyword.replaceAll(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "") ||
			keyword;
		if (common.keywords.find(key => key === keyword)) {
			return;
		}
		common.keywords = [keyword, ...common.keywords];
		store.commit("updateSettings", {});
	},
	removeKeyword(state: RootState, keyword: string) {
		const common = state.danmakuProfile.common;
		common.keywords = common.keywords.filter(i => i !== keyword);
		store.commit("updateSettings", {});
	},
	minify(state: RootState) {
		event.emit("routeChange", {
			name: "statusPanel"
		});
		state.minify = state.minify ? false : store.getters.isStreaming;
		event.emit("minify", state.minify);
	},
	addChangedDanmaku(state: RootState, danmaku: any) {
		state.changedDanmaku.unshift(danmaku);
	},
	cleanChangedDanmaku(state: RootState) {
		state.changedDanmaku = [];
	},
	addNewDanmaku(state: RootState, danmaku: any) {
		if (isElectron()) {
			wsevent.wsEmit("sendDanmaku", danmaku, "danmakuWeb");
		}
		const filter = state.filter;
		const preHandler = danmakuPreHandler[String(danmaku.type)];
		if (preHandler) {
			preHandler(danmaku, store);
		}
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
					(user: any) => user.userID === getUserInfo(danmaku).userID
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
						if (hasGift(filtered[0])) {
							shouldRead =
								!hasGift(filtered[0]) ||
								getGiftValue(filtered[0]) / 100 >=
									(settings?.robotSetting?.giftLevel || 0);
						}
					}
					if (!shouldRead) break;
					const { rules, ignoreOwner } = settings.robotSetting;
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
		}

		const handler = danmakuHandler[String(danmaku.type)];
		if (handler) {
			handler(danmaku, store);
		}
	}
};
