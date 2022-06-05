import merge from "lodash/merge";
export const randomId = (length = 6) => {
	let Num = "";
	for (let i = 0; i < length; i++) {
		Num += Math.floor(Math.random() * 10);
	}
	return Num;
};

export const removePunctuation = (str: string) => {
	return str.replaceAll(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");
};

export const removePunctuationSpace = (str: string) => {
	return str.replaceAll(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, " ");
};

export const escapeRegExp = (string: string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

export const basename = (path: string) => {
	return path.split("/").reverse()[0];
};

export const sleep = (time: any) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(1);
		}, time);
	});
};

export const assign = (dist: any, src: any) => {
	return merge(dist, src);
};

export const isUrl = (str: string) => {
	if (!str) {
		return false;
	}
	return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(
		str
	);
};

export const registerRole = (name: string) => {
	const win: any = window;
	win.role = name;
};

export const isDev = () => process.env.NODE_ENV === "development";
