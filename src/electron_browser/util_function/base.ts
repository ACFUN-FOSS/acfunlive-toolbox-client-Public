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

export const console = () => {
	if (process.env.NODE_ENV !== "production") {
		return window.console;
	}

	const ept = () => {
		return 1;
	};
	return {
		log: ept,
		info: ept,
		warn: ept,
		error: ept
	};
};

export const sleep = (time: any) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(1);
		}, time);
	});
};
