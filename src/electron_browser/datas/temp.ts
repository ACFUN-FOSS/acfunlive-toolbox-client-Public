export interface TempInfo {
	emojiTester: string;
	emojiMatcher: any;
}

export const tempInfo = () => {
	return {
		emojiTester: "",
		emojiMatcher: {}
	};
};
