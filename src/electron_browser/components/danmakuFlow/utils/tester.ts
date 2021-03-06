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
import { danmaku } from "@/electron_browser/datas";
export const hasTime = function(danmaku: any) {
	//@ts-ignore
	if (!danmaku) danmaku = this;
	return Boolean(getTime(danmaku));
};

export const hasMedal = function(danmaku: any) {
	//@ts-ignore
	if (!danmaku) danmaku = this;
	return Boolean(getMedal(danmaku).clubName);
};

export const hasAvatar = function(danmaku: any) {
	//@ts-ignore
	if (!danmaku) danmaku = this;
	return Boolean(getAvatar(danmaku));
};

export const hasNickName = function(danmaku: any) {
	//@ts-ignore
	if (!danmaku) danmaku = this;
	return Boolean(getNickName(danmaku));
};

export const hasContent = function(danmaku: any) {
	//@ts-ignore
	if (!danmaku) danmaku = this;
	return Boolean(getContent(danmaku));
};

export const hasGift = function(danmaku: any) {
	//@ts-ignore
	if (!danmaku) danmaku = this;
	return danmaku.type === 1005;
};

export const isManager = function(danmaku: any, state: RootState) {
	//@ts-ignore
	if (!danmaku) danmaku = this;
	//@ts-ignore
	if (!state) state = this.$store.state;
	return Boolean(
		state.managerList.find(
			i => i.userInfo.userID === getUserInfo(danmaku).userID
		)
	);
};

export const isOwner = function(danmaku: any, state: RootState) {
	//@ts-ignore
	if (!danmaku) danmaku = this;
	//@ts-ignore
	if (!state) state = this.$store.state;
	return Boolean(state.userSession.userID === getUserInfo(danmaku).userID);
};

export const isNormalDanmaku = function(danmaku: any) {
	//@ts-ignore
	if (!danmaku) danmaku = this;
	return [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008].includes(
		danmaku.type
	);
};

export const sameGift = function(danmakuA: any, danmakuB: any) {
	return (
		getGift(danmakuA).giftDetail.giftID ===
		getGift(danmakuB).giftDetail.giftID
	);
};

export const samePerson = function(danmakuA: any, danmakuB: any) {
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
