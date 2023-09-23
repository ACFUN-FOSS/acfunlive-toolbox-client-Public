export interface Session {
	rawFlow: Array<any>;
	filterFlow: Array<any>;
}

export const session = (): Session => {
	return {
		rawFlow: [],
		filterFlow: []
	};
};

export interface Filter {
	open: boolean;
	visitor: boolean;
	clubOnly: boolean;
	blackList: boolean;
	keyword: boolean;
	combineGift: boolean;
	combineLike: boolean;
	combineEnter: boolean;
	types: Array<number>;
}

export const filter = (): Filter => {
	return {
		open: true,
		visitor: true,
		clubOnly: false,
		blackList: true,
		keyword: true,
		combineGift: false, // 礼物合并
		combineLike: false, // 点赞合并
		combineEnter: false, // 重复进入直播间合并
		types: [1000, 1001, 1002, 1003, 1005, 1007, 1008]
	};
};

export interface Settings {
	filter: Filter;
	maxNum: number;
	clubLevel: number;
	speed: string;
	hightLight: any;
	animation: boolean;
	direction: string;
	settingOfType: any;
}

export const settings = (): Settings => {
	return {
		filter: filter(),
		maxNum: 75,
		clubLevel: 0,
		speed: "slow", // 尚未实现
		hightLight: {
			boss: true, // 未完成
			manager: false, // 未完成
			concerned: false // 未完成
		}, // 尚未实现
		animation: true, // 尚未实现
		direction: "addToBottom",
		settingOfType: {}
	};
};

export const webSettings = (): Settings => {
	return {
		...settings(),
		maxNum: 25
	};
};

export interface RobotSetting {
	rtype: string;
	api: any;
	enable: Array<any>;
	speed: number;
	volume: number;
	giftLevel: number;
	rules: any;
	ignoreOwner: boolean;
	comboReading: boolean;
}

export const robotRule = (): any => {
	return {
		1000: [],
		1001: [],
		1002: [],
		1003: [],
		1004: [],
		1005: [],
		1006: [],
		1007: [],
		1008: []
	};
};

export const robotSetting = (): RobotSetting => {
	return {
		rtype: "default",
		api: {
			apiSecret: "",
			appID: "",
			apiKey: "",
			voiceName: ""
		},
		enable: [],
		speed: 2,
		volume: 50,
		giftLevel: 0,
		rules: robotRule(),
		ignoreOwner: false,
		comboReading: false
	};
};

export interface clientSettings extends Settings {
	robotSetting: RobotSetting;
}

export const clientSettings = (): clientSettings => {
	return {
		...settings(),
		robotSetting: robotSetting()
	};
};

export interface emoji {
	pattern: string;
	url: string;
	scale: number;
}

export interface SuperChat {
	enable: boolean;
	webEnable: boolean;
	showNextLevel: boolean;
	rules: Array<any>;
	displayType: number;
}

export const superChat = () => {
	return {
		enable: false,
		webEnable: false,
		showNextLevel: false,
		rules: [],
		displayType: 0
	};
};

export interface CommonSettings {
	likeList: Array<any>;
	blackList: Array<any>;
	keywords: Array<any>;
	emojis: Array<emoji>;
	emotionMax: number;
	emotion: boolean;
	superChat: SuperChat;
}

export const commonSettings = (): CommonSettings => {
	return {
		likeList: [],
		blackList: [],
		keywords: [],
		emotion: true,
		emotionMax: 3,
		emojis: [],
		superChat: superChat()
	};
};

export interface GeneralSettings {
	streamToolPath: string;
	port: number;
	socket: number;
}

export const generalSettings = (): GeneralSettings => {
	return {
		streamToolPath: "",
		port: 1299,
		socket: 4396
	};
};

export interface Profile {
	general: GeneralSettings;
	common: CommonSettings;
	toolBox: clientSettings;
	web: Settings;
}

export const profile = (): Profile => {
	return {
		general: generalSettings(),
		common: commonSettings(),
		toolBox: clientSettings(),
		web: webSettings()
	};
};
