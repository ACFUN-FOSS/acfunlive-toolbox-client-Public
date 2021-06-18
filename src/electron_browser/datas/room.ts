export interface Profile {
	liveID: string;
	streamName: string;
	title: string;
	liveCover: string;
	liveStartTime: number;
	panoramic: boolean;
	bizUnit: string;
	bizCustomData: any;
}

export const profile = (): Profile => {
	return {
		liveID: "",
		streamName: "",
		title: "",
		liveCover: "",
		liveStartTime: 0,
		panoramic: false,
		bizUnit: "",
		bizCustomData: null
	};
};

export interface ProfileDetail extends Profile {
	liveType: {
		categoryID: number;
		categoryName: string;
		subCategoryID: number;
		subCategoryName: string;
	};
	hasFansClub: boolean;
	likeCount: number;
	onlineCount: number;
	portrait: boolean;
	paidShowUserBuyStatus: boolean;
	disableDanmakuShow: boolean;
}

export const profileDetail = (): ProfileDetail => {
	return {
		...profile(),
		liveType: category(),
		hasFansClub: false,
		likeCount: 0,
		onlineCount: 0,
		portrait: false,
		paidShowUserBuyStatus: false,
		disableDanmakuShow: false
	};
};

export interface Category {
	categoryID: number;
	categoryName: string;
	subCategoryID: number;
	subCategoryName: string;
}

export const category = (): Category => {
	return {
		categoryID: 1,
		categoryName: "",
		subCategoryID: 1,
		subCategoryName: ""
	};
};

export interface Statistic {
	likeCount: number;
	giftCount: number;
	diamondCount: number;
	bananaCount: number;
	watchCount: number;
	duration: number;
}

export const statistic = (): Statistic => {
	return {
		likeCount: 0,
		giftCount: 0,
		diamondCount: 0,
		bananaCount: 0,
		watchCount: 0,
		duration: 0
	};
};

export interface Status {
	liveDurationTimer: any;
	giftTimer: any;
	liveDuration: number;
	watchingCount: string;
	statistic: Statistic;
}

export const status = (): Status => {
	return {
		liveDurationTimer: null,
		giftTimer: null,
		liveDuration: 0,
		watchingCount: "0", // 弹幕直接获取
		statistic: statistic()
	};
};

export interface Rank {
	rankList: Array<any>;
	clubName: string;
	medalCount: number;
	hasMedal: boolean;
	userFriendshipDegree: number;
	userRank: number;
}
export const rank = (): Rank => {
	return {
		rankList: [],
		clubName: "",
		medalCount: 0,
		hasMedal: true,
		userFriendshipDegree: 0,
		userRank: 0
	};
};
