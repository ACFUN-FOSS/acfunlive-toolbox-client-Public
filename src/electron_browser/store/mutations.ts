import { RootState, stateFunc } from "./state";
import store from "./index";
import Cookies from "@fe/utils/cookies";
import { event } from "@fe/api/eventBus";
import { danmakuHandler } from "./danmaku/danmaku";
import { stream } from "@fe/api/ws_h";
import { ElMessage } from "element-plus";
export const mutations: any = {
	reset() {
		store.replaceState(stateFunc());
	},

	async getUserInfo(state: RootState) {
		const res = await state.api.getUserStreamInfo(state.userSession);

		if (res) {
			const changed = state.streamStatus.underway !== Boolean(res.liveID);
			state.streamStatus.underway = Boolean(res.liveID);
			Object.assign(state.userProfile, res.profile);
			delete res.profile;
			Object.assign(state.roomProfile, res);
			if (changed) {
				event.emit("roomStatusChanged", res);
			}
		}
	},

	async setRoomProfile(state: RootState, roomSetInfo: any) {
		await state.api.setRoomProfile(roomSetInfo);
		event.emit("roomProfileChanged");
	},

	async getCategory(state: RootState) {
		try {
			state.roomCategorys = (await state.api.getCategory()) || [];
		} catch (error) {
			state.roomCategorys = [];
		}
	},

	async openStream(state: RootState, streamStartInfo: any) {
		const res = await state.api.openStream(streamStartInfo);
		if (res && res.liveID) {
			state.streamStatus.underway = true;
			event.emit("liveStarted");
		}
	},

	async closeStream(state: RootState, liveID: string) {
		clearInterval(state.roomStatus.liveDurationTimer);
		const res = await state.api.closeStream(liveID);
		if (res.endReason) {
			state.streamSession = stream.getSession();
			event.emit("liveEnded");
		}
	},

	async checkStreamable(state: RootState) {
		try {
			state.streamStatus.avaliable = (
				await state.api.checkStreamable()
			).liveAuth;
		} catch (error) {
			console.log(error);
			state.streamStatus.avaliable = false;
		}
	},

	async getStreamSession(state: RootState) {
		try {
			state.streamSession =
				(await state.api.getStreamSession()) || stream.getSession();
		} catch (error) {
			state.streamSession = stream.getSession();
		}
		state.streamStatus.connected = false;
	},

	async getStreamEncodec(state: RootState) {
		const streamName =
			state.roomProfile.streamName || state.streamSession.streamName;
		if (!streamName) {
			return;
		}
		try {
			state.streamEncodec =
				(await state.api.getStreamEncodec(streamName))[0] ||
				stream.getEncodec();
		} catch (error) {
			state.streamEncodec = stream.getEncodec();
		}
	},

	getDanmaku(state: RootState) {
		state.api.getDanmaku(state.userSession, (e: any) => {
			const handler = danmakuHandler[String(e.type)];
			state.danmakuSession.rawFlow.unshift(e);
			// 监测弹幕长度（按照过滤后的来算）
			const dev =
				store.getters.danmakuList.length - state.danmakuProfile.maxNum;
			if (dev > 0) {
				state.danmakuSession.rawFlow.splice(
					-1,
					state.danmakuSession.rawFlow.length -
						state.danmakuSession.rawFlow.indexOf(
							store.getters.danmakuList[
								state.danmakuProfile.maxNum - 1
							]
						)
				);
			}
			if (handler) {
				handler(e, store);
			}
		});
		state.streamStatus.danmaku = true;
		clearInterval(state.roomStatus.liveDurationTimer);
		state.roomStatus.liveDurationTimer = setInterval(() => {
			state.roomStatus.liveDuration =
				new Date().getTime() - state.roomProfile.liveStartTime;
		}, 1000);
	},
	async stopDanmaku(state: RootState) {
		clearInterval(state.roomStatus.liveDurationTimer);
		await state.api.stopDanmaku(state.userSession);
		state.streamStatus.danmaku = false;
	}
};
