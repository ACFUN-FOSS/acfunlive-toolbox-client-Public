import { danmaku } from "@/electron_browser/datas";

export const getDanmuInfo = (danmaku: any) => {
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

export const getUserInfo = (danmaku: any) => {
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

export const getTime = (danmaku: any) => {
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

export const getMedal = (danmaku: any) => {
	return getUserInfo(danmaku).medal;
};

export const getMedalLevel = (danmaku: any) => {
	return getMedal(danmaku).level;
};

export const getMedalName = (danmaku: any) => {
	return getMedal(danmaku).clubName;
};

export const getAvatar = (danmaku: any) => {
	return getUserInfo(danmaku).avatar;
};

export const getNickName = (danmaku: any) => {
	return getUserInfo(danmaku).nickname;
};

export const getUID = (danmaku: any) => {
	return getUserInfo(danmaku).userID;
};

export const getContent = (danmaku: any) => {
	if (danmaku.type !== 1000) {
		return "";
	}
	return danmaku.data.content;
};

export const getGift = (danmaku: any) => {
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
export const getDanmakuType = (danmaku: any) => {
	return danmaku.type;
};

export const getGiftName = (danmaku: any) => {
	return getGift(danmaku)?.giftDetail.giftName;
};

export const getGiftCombo = (danmaku: any) => {
	return getGift(danmaku)?.combo;
};

export const getGiftNumber = (danmaku: any) => {
	return getGift(danmaku)?.count;
};

export const setGiftNumber = (danmaku: any, number: any) => {
	danmaku.data.count = number;
};

export const getGiftValue = (danmaku: any) => {
	if (getGift(danmaku)?.giftDetail.payWalletType === 1) {
		return getGift(danmaku)?.value;
	}
	return 0;
};

export const getRichText = (danmaku: any) => {
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
