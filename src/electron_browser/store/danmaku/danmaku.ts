import { Store } from "vuex";
import { isElectron } from "@front/util_function/electron";
import { danmaku as danmakuData } from "@front/datas";
import { ElMessageBox } from "element-plus";
const empty = (data: any): number => {
	return data;
};

export const danmakuText = empty;

export const danmakuLike = empty;
export const danmakuEnter = empty;
export const danmakuSubscribe = empty;
export const danmakuGift = empty;
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
	if (sessionStorage.getItem("preStep") === "danmakuing") {
		sessionStorage.setItem("preStep", "");
		return;
	}
	const state = store.state;
	const settings: any = isElectron()
		? state.danmakuProfile.toolBox
		: state.danmakuProfile.web;
	const commonSettings =
		state.danmakuProfile.common || danmakuData.commonSettings();
	const rank = state.rank;
	const filtered = store.state.filter.filterUpdate(
		e.data.map((danmaku: any) => {
			return {
				type: 1000,
				data: danmaku
			};
		}),
		state.danmakuSession.filterFlow,
		settings,
		commonSettings,
		rank
	);
	store.state.danmakuSession.filterFlow = filtered.list;
};

export const warning = (e: any) => {
	if (!isElectron()) {
		return;
	}
	ElMessageBox({
		message: "恁被C类警告了！",
		type: "warning"
	});
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
