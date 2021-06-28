export interface TempInfo {
	emojiTester: string;
	emojiMatcher: any;
	superChatArray: Array<any>;
	superChatID: any;
	superChatBlock: any;
}

export const tempInfo = () => {
	return {
		emojiTester: "",
		emojiMatcher: {},
		superChatArray: [],
		superChatID: false,
		superChatBlock: null
	};
};
