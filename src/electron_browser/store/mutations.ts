import { RootState, stateFunc } from "./state";
import store from "./index";
import { event } from "@front/util_function/eventBus";
import { stream as streamData, temp } from "@front/datas";
import { room, stream, common, wsevent, statistic, user } from "@front/api";
import { cloneDeep } from "lodash";
import { saveConfig } from "@front/util_function/system";
export const mutations: any = {
	reset() {
		store.replaceState(stateFunc());
		sessionStorage.setItem("preStep", "online");
	},
	getRoomProfile(state: RootState) {
		user.streamInfo(state.userSession).then(res => {
			if (!res) {
				throw new Error("no streamInfo");
			}
			Object.assign(state.userProfile, res.profile);
			delete res.profile;
			Object.assign(state.roomProfile, res);
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
			wsevent.wsEmit("update-rank", res, "client");
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
		store.commit("stopLiveDurationTimer");
		store.commit("stopGiftTimer");
		wsevent.wsEmit("stop-danmaku", {}, "client");
		sessionStorage.setItem("preStep", "");
		store.commit("getStreamSession");
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
			wsevent.wsEmit("update-style", {}, "client");
		}, 500);
	},
	updateSettings(state: RootState, { settingType, setting }: any) {
		if (settingType && setting) {
			// @ts-ignore
			state.danmakuProfile[settingType] = cloneDeep(setting);
		}
		state.temp = temp.tempInfo();
		saveConfig(state.danmakuProfile);
		setTimeout(() => {
			wsevent.wsEmit("update-settings", {}, "client");
		}, 1000);
	},
	getManagerList(state: RootState) {
		room.getManagerList().then((res: any) => {
			if (res) state.managerList = res;
			wsevent.wsEmit(
				"update-manager",
				{ list: state.managerList },
				"client"
			);
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
	}
};
