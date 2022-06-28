import replace from "lodash/replace";
import { isElectron } from "@front/util_function/electron";
import { escapeRegExp } from "@front/util_function/base";
import store from "@front/store/index";
export const getDanmuInfo = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	const type = danmaku?.type;
	switch (type) {
		case 1000:
		case 1008:
			return danmaku.data.danmuInfo;
		case 1001:
			return danmaku.data;
		case 1002:
			return danmaku.data;
		case 1003:
			return danmaku.data;
		case 1004:
			return danmaku.data;
		case 1005:
			return danmaku.data.danmuInfo;
		case 1006:
			return danmaku.data;
		case 1007:
			return danmaku.data;
		default:
			return 0;
	}
};

export const getUserInfo = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	const type = danmaku?.type;
	switch (type) {
		case 1007:
			return getDanmuInfo(danmaku).fansInfo;
		case 1006:
			return {};
		default:
			return getDanmuInfo(danmaku).userInfo;
	}
};

export const getTime = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	const type = danmaku?.type;
	switch (type) {
		case 1007:
			if (!getDanmuInfo(danmaku)?.joinTime) {
				danmaku.data.joinTime = Date.now();
			}
			return danmaku?.data?.joinTime;
		default:
			return getDanmuInfo(danmaku)?.sendTime;
	}
};

export const setTime = (danmaku: any, time: any) => {
	const type = danmaku?.type;
	switch (type) {
		case 1007:
			danmaku.data.joinTime = time;
			break;
		default:
			getDanmuInfo(danmaku).sendTime = time;
	}
	return danmaku;
};

export const getMedal = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return getUserInfo(danmaku).medal;
};

export const getMedalLevel = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return getMedal(danmaku).level;
};

export const getMedalName = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return getMedal(danmaku).clubName;
};

export const getAvatar = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return getUserInfo(danmaku).avatar;
};

export const getNickName = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return getUserInfo(danmaku).nickname;
};

export const getUID = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return getUserInfo(danmaku).userID;
};

export const getContent = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	if (danmaku.type !== 1000) {
		return "";
	}
	return danmaku?.data?.content;
};

export const getGift = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	if (danmaku.type !== 1005) {
		return {
			display: false
		};
	}
	return {
		display: true,
		...danmaku.data
	};
};
export const getDanmakuType = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return danmaku.type;
};

export const getGiftName = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return getGift(danmaku)?.giftDetail.giftName;
};

export const getGiftCombo = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return getGift(danmaku)?.combo;
};

export const getGiftNumber = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	return getGift(danmaku)?.count;
};

export const setGiftNumber = (danmaku: any, number: any) => {
	danmaku.data.count = number;
};

export const getGiftValue = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	if (getGift(danmaku)?.giftDetail.payWalletType === 1) {
		return getGift(danmaku)?.value;
	}
	return 0;
};

export const getRichText = function(danmaku: any) {
	//@ts-ignore

	if (!danmaku) danmaku = this;
	const content: Array<string> = [];
	danmaku.data.segments.forEach((i: any) => {
		switch (i.type) {
			case 1900:
				content.push(i.segment.userInfo.nickname);
				break;
			default:
				content.push(i.segment.text);
		}
	});
	return content.join(" ");
};

export const robotGetters = {
	getTime,
	getMedalLevel,
	getMedalName,
	getNickName,
	getContent,
	getGiftName,
	getGiftNumber,
	getGiftValue,
	getRichText
};

export const getterOptions = () => {
	return [
		{
			label: "时间",
			value: "getTime",
			avaliable: [1000, 1001, 1002, 1003, 1005, 1007]
		},
		{
			label: "牌子等级",
			value: "getMedalLevel",
			avaliable: [1000, 1001, 1002, 1003, 1005]
		},
		{
			label: "牌子名",
			value: "getMedalName",
			avaliable: [1000, 1001, 1002, 1003, 1005]
		},
		{
			label: "用户名",
			value: "getNickName",
			avaliable: [1000, 1001, 1002, 1003, 1005, 1007]
		},
		{
			label: "评论",
			value: "getContent",
			avaliable: [1000]
		},
		{
			label: "礼物名字",
			value: "getGiftName",
			avaliable: [1005]
		},
		{
			label: "礼物数量",
			value: "getGiftNumber",
			avaliable: [1005]
		},
		{
			label: "礼物价值",
			value: "getGiftValue",
			avaliable: [1005]
		},
		{
			label: "系统通知",
			value: "getRichText",
			avaliable: [1006]
		}
	];
};

export const getContentWithEmoji = function(danmaku: any) {
	//@ts-ignore
	if (!danmaku) danmaku = this;

	const { danmakuProfile, temp }: any = store.state;
	let content = getContent(danmaku);
	if (!danmakuProfile?.common?.emotion) {
		return content;
	}
	let { emojiTester, emojiMatcher } = temp;
	if (!emojiTester || !emojiMatcher) {
		const { matcher, tester } = generateTester();
		emojiTester = temp.emojiTester = tester;
		emojiMatcher = temp.emojiMatcher = matcher;
	}
	if (isElectron()) {
		[...content.matchAll(/(ac|AC|aC|Ac)\d+/g)].forEach(match => {
			content = replace(
				content,
				match[0],
				`<a target="_blank" href="https://www.acfun.cn/v/${match[0]}" style="color:rgb(100,238,238)">${match[0]}(点击查看)</a>`
			);
		});
	}
	const max = danmakuProfile.common.emotionMax || 3;
	[...content.matchAll(emojiTester)].forEach((match, index) => {
		if (!emojiMatcher[match[0]]) {
			return;
		}
		let replacement = "";
		if (index < max) {
			replacement = `<img style="max-width:${
				emojiMatcher[match[0]].scale
			}px;margin-left:8px;margin-top:8px;vertical-align:bottom" src="${
				emojiMatcher[match[0]].url
			}" />`;
		}
		content = content.replace(match[0], replacement);
	});
	return content;
};
export const generateTester = function() {
	const matcher = {};
	const testerArr: any = [];

	const { danmakuProfile, temp }: any = store.state;
	danmakuProfile.common.emojis.forEach((emoji: any) => {
		const regex = escapeRegExp(emoji.pattern);
		testerArr.push(regex);
		// @ts-ignore
		matcher[emoji.pattern] = {
			url: emoji.url,
			scale: emoji.scale,
			regex: new RegExp(regex, "g")
		};
	});
	const tester = (temp.emojiTester = new RegExp(testerArr.join("|"), "g"));
	temp.emojiMatcher = matcher;
	return {
		tester,
		matcher
	};
};
