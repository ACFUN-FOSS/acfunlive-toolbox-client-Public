export interface TempInfo {
	emojiTester: string;
	emojiMatcher: any;
	superChatArray: Array<any>;
	superChatID: any;
	superChatBlock: any;
	likeList: any;
}

export const tempInfo = () => {
	return {
		emojiTester: "",
		emojiMatcher: {},
		superChatArray: [],
		superChatID: false,
		superChatBlock: null,
		likeList: {}
	};
};

export interface LikeTemp {
	enterTime: number;
	userID: number;
	isLive: boolean;
}

export const likeTemp = () => {
	return {
		enterTime: 0,
		userID: 0,
		isLive: false
	};
};
