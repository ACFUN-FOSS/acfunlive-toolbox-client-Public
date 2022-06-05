export const walk = (obj: any, fn: any = () => true): Array<any> => {
	if (typeof obj === "object") {
		obj = Object.values(obj);
	} else {
		if (fn(obj)) {
			return [obj];
		}
		return [];
	}
	const output: any = [];
	obj.forEach((item: any) => {
		output.push(...walk(item, fn));
	});
	return output;
};
