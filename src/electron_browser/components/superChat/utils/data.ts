export interface SuperChatBlockSetting {
	triggerValue: number;
	theme: any;
	themeID: any;
	listDuration: number;
}

export const superChatBlockSetting = (): SuperChatBlockSetting => {
	return {
		triggerValue: 99,
		theme: "",
		themeID: "",
		listDuration: 55000
	};
};

export interface SuperChatBlock extends SuperChatBlockSetting {
	panelEndTime: number;
	listEndTime: number;
	createTime: number;
	value: number;
	content: string;
	avatar: string;
	nickName: string;
	showed: boolean;
	number: number;
	nextLevel: number;
	uid: number;
}

export const superChatBlock = (): SuperChatBlock => {
	return {
		...superChatBlockSetting(),
		panelEndTime: 0,
		listEndTime: 0,
		createTime: 0,
		value: 0,
		content: "",
		avatar: "",
		nickName: "",
		showed: false,
		number: 0,
		nextLevel: 0,
		uid: 0
	};
};
