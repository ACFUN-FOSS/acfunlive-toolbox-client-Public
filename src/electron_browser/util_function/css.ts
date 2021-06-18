export const initCssVar = (obj: any, parent: string): any => {
	let result: any = {};
	for (const key in obj) {
		if (typeof obj[key] !== "object") {
			result[`${parent}${parent ? "_" : "--"}${key}`] = obj[key];
		} else {
			result = {
				...result,
				...initCssVar(obj[key], `${parent}${parent ? "_" : "--"}${key}`)
			};
		}
	}
	return result;
};
