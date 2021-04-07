import { Store } from "vuex";

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
	store.state.roomStatus.bananaCount = e.data.bananaCount;
};
export const signalAudience = (e: any, store: Store<any>) => {
	store.state.roomStatus.watchingCount = e.data.watchingCount;
	store.state.roomStatus.likeCount = e.data.likeCount;
};
export const danmakuHistory = (e: any, store: Store<any>) => {
	store.state.danmakuSession.rawFlow = e.data.reverse().map((item: any) => {
		return {
			type: 1000,
			data: item
		};
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
	3001: empty,
	3002: empty
};
