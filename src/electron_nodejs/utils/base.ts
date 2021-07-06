export const randomId = (length = 6) => {
	let Num = "";
	for (let i = 0; i < length; i++) {
		Num += Math.floor(Math.random() * 10);
	}
	return Num;
};
