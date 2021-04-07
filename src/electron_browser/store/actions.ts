import { stream } from "../api/ws_h";

export const actions = {
	async startServe(store: any): Promise<boolean> {
		setTimeout(() => {
			store.dispatch("startServe");
		}, 3000);
		store.state.serverOnline = await store.state.api.init();
		return new Promise(resolve => {
			resolve(store.state.serverOnline);
		});
	},
	async checkStreamStatus(store: any): Promise<void> {
		// stream && danmaku  finite-state machine
		clearTimeout(store.state.streamStatus.checker);
		if (!store.state.streamStatus.underway) {
			await store.commit("checkStreamable");
		}
		if (!store.state.streamSession.streamName) {
			await store.commit("getStreamSession"); // get rtmp key when no streaming
		} else {
			await store.commit("getStreamEncodec");
		}
		await store.commit("getUserInfo"); // check stream underway by tokenInfo
		store.dispatch("switchDanmaku"); // open/stop danmaku by underway

		store.state.streamStatus.checker = setTimeout(() => {
			store.dispatch("checkStreamStatus");
		}, 10000);
	},
	switchDanmaku(store: any): void {
		if (
			store.state.streamStatus.underway ===
			store.state.streamStatus.danmaku
		) {
			return;
		}
		if (
			store.state.streamStatus.underway &&
			!store.state.streamStatus.danmaku
		) {
			store.commit("getDanmaku");
			return;
		}
		store.commit("stopDanmaku");
	}
};
