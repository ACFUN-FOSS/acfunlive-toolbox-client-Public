import {
	mergeConfig
} from "./utils";

export const DEFAULT_CONFIG = {
	minGiftPrice: 0, // ￥0
	exchangeRate: 1, // 1 -> ￥1
	showDanmaku: true,
	showEqualMedal: false,
	showFollow: true,
	followText: "",
	showJoin: true,
	joinText: "",
	showQuit: false,
	quitText: "",
	showLove: true,
	loveText: "",
	showJoinGroup: true,
	joinGroupText: "",
	showGift: true,
	showGiftPrice: true,
	showACCoinInstead: false,
	showGiftPngInstead: false,
	showGiftName: true,
	mergeSimilarDanmaku: true,
	mergeSimilarOther: true,
	mergeGift: true,
	maxNumber: 60,

	blockGiftDanmaku: false,
	blockKeywords: "",
	blockUsers: "",
	blockMedalLevel: 0,

	autoTranslate: false
};

export const VERSION = "0.4.1";

export function setLocalConfig(config) {
	config = mergeConfig(config, DEFAULT_CONFIG);
	window.localStorage.config = JSON.stringify(config);
}

export function getLocalConfig() {
	if (!window.localStorage.config) {
		return DEFAULT_CONFIG;
	}
	return mergeConfig(JSON.parse(window.localStorage.config), DEFAULT_CONFIG);
}
