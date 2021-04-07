export const getDanmuInfo = (danmaku: any) => {
	const type = danmaku.type;
	switch (type) {
		case 1000:
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
	const type = danmaku.type;
	switch (type) {
		case 1007:
			return getDanmuInfo(danmaku).fansInfo;
		default:
			return getDanmuInfo(danmaku).userInfo;
	}
};
export const getTime = (danmaku: any) => {
	const type = danmaku.type;
	switch (type) {
		case 1007:
			return danmaku.data.joinTime;
		default:
			return getDanmuInfo(danmaku).sendTime;
	}
};

export const getMedal = (danmaku: any) => {
	return getUserInfo(danmaku).medal;
};

export const getAvatar = (danmaku: any) => {
	return getUserInfo(danmaku).avatar;
};
export const getNickName = (danmaku: any) => {
	return getUserInfo(danmaku).nickname;
};

export const getContent = (danmaku: any) => {
	return danmaku.data.content;
};
