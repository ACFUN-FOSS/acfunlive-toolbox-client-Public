import { Store } from "vuex";
import { isElectron } from "@front/util_function/electron";
import { danmaku as danmakuData } from "@front/datas";
import { likeTemp } from "@front/datas/temp";
import { ElMessageBox, ElMessage } from "element-plus";
import {
	scGiftHandler,
	scTextHandler
} from "@front/components/superChat/utils/getter";
import { escape } from "lodash";
import {
	getUID,
	getNickName,
	getContent
} from "@front/components/danmakuFlow/utils/getter";
const empty = (data: any): number => {
	return data;
};
const removeElementsByTagName = (div: any, tagName: string) => {
	const collection: any = div.getElementsByTagName(tagName);
	for (const i of collection) {
		i.remove();
	}
};

export const danmakuText = (e: any, store: Store<any>) => {
	if (store.getters.superChatEnable) {
		scTextHandler(e, store);
	}
};

export const danmakuTextPre = (e: any, store: Store<any>) => {
	e.data.content = escape(getContent(e));
};

export const danmakuLike = empty;
export const danmakuEnter = (e: any, store: Store<any>) => {
	if (isElectron()) {
		const likeList = store.state.danmakuProfile.common.likeList || [];
		const tempLike = store.state.temp.likeList;
		const id = getUID(e);
		let needMetion = false;
		if (likeList.find((i: any) => i.userID === id)) {
			const current = Date.now();
			if (tempLike[id]) {
				if (current - tempLike[id].enterTime > 600000) {
					needMetion = true;
				}
				tempLike[id].enterTime = current;
			} else {
				needMetion = true;
				tempLike[id] = {
					...likeTemp(),
					userID: id,
					enterTime: current
				};
			}
		}
		if (needMetion) {
			ElMessage({
				message: `${getNickName(e)}来直播间看你拉！`,
				duration: 5000,
				offset: 160,
				type: "success"
			});
		}
	}
};
export const danmakuSubscribe = empty;
export const danmakuGift = (e: any, store: Store<any>) => {
	if (store.getters.superChatEnable) {
		scGiftHandler(e, store);
	}
};
export const danmakuRichText = empty;
export const danmakuJoinClub = empty;
export const signalBanana = (e: any, store: Store<any>) => {
	// store.state.roomStatus.bananaCount = e.data.bananaCount;
};
export const signalAudience = (e: any, store: Store<any>) => {
	store.state.roomStatus.watchingCount = e.data.watchingCount;
	// store.state.roomStatus.likeCount = e.data.likeCount;
};
export const danmakuHistory = (e: any, store: Store<any>) => {
	const filteredFlow = store.state.danmakuSession.filterFlow;
	if (filteredFlow.length && !filteredFlow[0].mock) {
		return;
	}
	const state = store.state;
	const settings: any = isElectron()
		? state.danmakuProfile.toolBox
		: state.danmakuProfile.web;
	const commonSettings =
		state.danmakuProfile.common || danmakuData.commonSettings();
	const rank = state.rank;
	const { list } = store.state.filter.filterUpdate(
		e.data.map((danmaku: any) => {
			danmaku = { type: 1000, data: danmaku };
			danmakuTextPre(danmaku, store);
			return danmaku;
		}),
		state.danmakuSession.filterFlow,
		settings,
		commonSettings,
		rank
	);
	store.state.danmakuSession.filterFlow = list;
};

export const warning = (e: any) => {
	if (!isElectron()) {
		return;
	}
	ElMessageBox({
		message: `恁被C类警告累~${e.data.violationContent}`,
		type: "warning"
	});
};

export const danmakuPreHandler: any = {
	1000: danmakuTextPre
};

export const danmakuHandler: any = {
	1000: danmakuText,
	1001: danmakuLike,
	1002: danmakuEnter,
	1003: danmakuSubscribe,
	1004: empty,
	1005: danmakuGift,
	1006: danmakuRichText,
	1007: danmakuJoinClub,
	2000: empty,
	2001: signalBanana,
	2002: signalAudience,
	2003: empty,
	2004: danmakuHistory,
	2005: empty,
	2100: empty,
	2101: empty,
	2102: empty,
	2103: empty,
	3000: empty,
	3001: warning,
	3002: empty
};
