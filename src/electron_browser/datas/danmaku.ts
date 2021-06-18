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
		types: [1000, 1001, 1002, 1003, 1005, 1007]
	};
};

export interface Settings {
	filter: Filter;
	maxNum: number;
	clubLevel: number;
	speed: string;
	hightLight: any;
	animation: boolean;
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
	enable: boolean;
	speed: number;
	volume: number;
	rules: any;
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
		1007: []
	};
};

export const robotSetting = (): RobotSetting => {
	return {
		enable: false,
		speed: 2,
		volume: 50,
		rules: robotRule()
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

export interface CommonSettings {
	blackList: Array<any>;
	keywords: Array<any>;
	emojis: Array<emoji>;
	emotionMax: number;
	emotion: boolean;
}

export const commonSettings = (): CommonSettings => {
	return {
		blackList: [],
		keywords: [],
		emotion: true,
		emotionMax: 3,
		emojis: []
	};
};

export interface Profile {
	common: CommonSettings;
	toolBox: clientSettings;
	web: Settings;
}

export const profile = (): Profile => {
	return {
		common: commonSettings(),
		toolBox: clientSettings(),
		web: webSettings()
	};
};
