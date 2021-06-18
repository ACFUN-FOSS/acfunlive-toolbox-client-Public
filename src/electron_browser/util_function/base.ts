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
