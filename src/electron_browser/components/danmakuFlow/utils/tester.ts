import {
	getTime,
	getMedal,
	getAvatar,
	getNickName,
	getContent,
	getUserInfo,
	getGift
} from "./getter";
import { RootState } from "@front/store/state";
export const hasTime = (danmaku: any) => {
	return Boolean(getTime(danmaku));
};

export const hasMedal = (danmaku: any) => {
	return Boolean(getMedal(danmaku).clubName);
};

export const hasAvatar = (danmaku: any) => {
	return Boolean(getAvatar(danmaku));
};

export const hasNickName = (danmaku: any) => {
	return Boolean(getNickName(danmaku));
};

export const hasContent = (danmaku: any) => {
	return Boolean(getContent(danmaku));
};

export const isManager = (danmaku: any, state: RootState) => {
	return Boolean(
		state.managerList.find(
			i => i.userInfo.userID === getUserInfo(danmaku).userID
		)
	);
};

export const isOwner = (danmaku: any, state: RootState) => {
	return Boolean(state.userSession.userID === getUserInfo(danmaku).userID);
};

export const sameGift = (danmakuA: any, danmakuB: any) => {
	return (
		getGift(danmakuA).giftDetail.giftID ===
		getGift(danmakuB).giftDetail.giftID
	);
};

export const samePerson = (danmakuA: any, danmakuB: any) => {
	return getUserInfo(danmakuA).userID === getUserInfo(danmakuB).userID;
};

export const basicComponentTester = {
	1000: [hasNickName, hasAvatar, hasMedal, hasContent, hasTime],
	1001: [hasNickName, hasAvatar, hasMedal, hasTime],
	1002: [hasNickName, hasAvatar, hasMedal, hasTime],
	1003: [hasNickName, hasAvatar, hasMedal, hasTime],
	1004: [hasNickName, hasTime],
	1005: [hasNickName, hasAvatar, hasMedal, hasTime],
	1006: [],
	1007: [hasNickName, hasTime]
};
