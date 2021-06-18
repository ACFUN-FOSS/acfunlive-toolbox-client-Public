const { clipboard } = require("electron");

export const copyText = (text: string) => {
	return new Promise((resolve) => {
		clipboard.writeText(text);
		resolve(text);
	});
};
