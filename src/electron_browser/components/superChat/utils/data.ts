export interface SuperChatBlockSetting {
	triggerValue: number;
	theme: any;
	themeID: any;
	listDuration: number;
}

export const superChatBlockSetting = (): SuperChatBlockSetting => {
	return {
		triggerValue: 99,
		theme: {
			config: {
				text: "我永远单推主播！"
			},
			background: {
				backgroundType: 0,
				backgroundColor: "rgba(16,128,185,1)",
				backgroundImage: "",
				backgroundSize: 100,
				backgroundPosition: "center",
				backgroundDynamic: "default",
				backgroundSizeType: 0,
				backgroundOpacity: 100
			},
			listStyle: {
				font: "/fonts/站酷快乐体.ttf",
				fontSize: 14,
				fontWeight: "bolder",
				color: "rgba(255, 255, 255, 1)",
				textShadowWidth: 0.6,
				textShadowColor: "#000"
			},
			panelStyle: {
				font: "/fonts/极影毁片圆.ttf",
				fontSize: 14,
				fontWeight: "lighter",
				color: "rgba(255, 255, 255, 1)",
				textShadowWidth: 0.6,
				textShadowColor: "#000"
			}
		},
		themeID: "0",
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
