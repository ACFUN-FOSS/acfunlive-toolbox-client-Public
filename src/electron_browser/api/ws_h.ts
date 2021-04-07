export namespace user {
	export interface data {
		account: string;
		password: string;
	}

	export const getData = (): data => {
		return {
			account: "",
			password: ""
		};
	};

	export interface profile {
		userID: number;
		nickname: string;
		signature: string;
		verifiedText: string;
		followingCount: number;
		fansCount: number;
		contributeCount: number;
		avatar: string;
		avatarFrame: string;
	}

	export const getProfile = (): profile => {
		return {
			userID: 0,
			nickname: "",
			signature: "",
			verifiedText: "",
			followingCount: 0,
			fansCount: 0,
			contributeCount: 0,
			avatar: "",
			avatarFrame: ""
		};
	};

	export interface session {
		userID: number;
		securityKey: string;
		serviceToken: string;
		deviceID: string;
		cookies: Array<string>;
	}

	export const getSession = (): session => {
		return {
			userID: 0,
			securityKey: "",
			serviceToken: "",
			deviceID: "",
			cookies: []
		};
	};
}

export namespace room {
	export interface profile {
		liveID: string;
		streamName: string;
		title: string;
		liveCover: string;
		liveStartTime: number;
		panoramic: boolean;
		bizUnit: string;
		bizCustomData: any;
	}

	export const getProfile = (): profile => {
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

	export interface profileDetail extends profile {
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

	export const getProfileDetail = (): profileDetail => {
		return {
			...getProfile(),
			liveType: getCategory(),
			hasFansClub: false,
			likeCount: 0,
			onlineCount: 0,
			portrait: false,
			paidShowUserBuyStatus: false,
			disableDanmakuShow: false
		};
	};

	export interface category {
		categoryID: number;
		categoryName: string;
		subCategoryID: number;
		subCategoryName: string;
	}

	export const getCategory = (): category => {
		return {
			categoryID: 1,
			categoryName: "",
			subCategoryID: 1,
			subCategoryName: ""
		};
	};

	export interface status {
		liveDurationTimer: any;
		liveDuration: number;
		bananaCount: string;
		watchingCount: string;
		likeCount: string;
	}

	export const getStatus = (): status => {
		return {
			liveDurationTimer: null,
			liveDuration: 0,
			bananaCount: "0",
			watchingCount: "0",
			likeCount: "0"
		};
	};
}

export namespace stream {
	export interface status {
		checker: any;
		avaliable: boolean;
		connected: boolean;
		underway: boolean;
		danmaku: boolean;
	}
	export const getStatus = (): status => {
		return {
			checker: null,
			avaliable: false,
			connected: false,
			underway: false,
			danmaku: false
		};
	};

	export interface session {
		streamName: string;
		streamPullAddress: string;
		streamPushAddress: Array<string>;
		panoramic: boolean;
		interval: number;
		rtmpServer: string;
		streamKey: string;
	}

	export const getSession = (): session => {
		return {
			streamName: "",
			streamPullAddress: "",
			streamPushAddress: [],
			panoramic: false,
			interval: 5000,
			rtmpServer: "",
			streamKey: ""
		};
	};

	export interface url {
		url: string;
		bitrate: number;
		qualityType: string;
		qualityName: string;
	}

	export const getUrl = (): url => {
		return {
			url: "",
			bitrate: 0,
			qualityType: "",
			qualityName: ""
		};
	};

	export interface encodec {
		streamUrl: url;
		resolution: string;
		frameRate: number;
		template: string;
	}

	export const getEncodec = (): encodec => {
		return {
			streamUrl: getUrl(),
			resolution: "",
			frameRate: 0,
			template: ""
		};
	};
}

export namespace danmaku {
	export interface session {
		rawFlow: Array<any>;
	}

	export const getSession = (): session => {
		return {
			rawFlow: []
		};
	};

	export interface filter {
		web: boolean;
		client: boolean;
	}

	export const getFilter = (): filter => {
		return {
			web: true,
			client: true
		};
	};

	export interface profile {
		danmaku: filter;
		maxNum: number;
	}

	export const getProfile = (): profile => {
		return {
			danmaku: getFilter(),
			maxNum: 150
		};
	};
}
