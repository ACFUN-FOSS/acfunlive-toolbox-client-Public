export const unixTimeFormatter = (timestamp: number) => {
	const zeroPadding = (n: string) => {
		if (n.length < 2) {
			return `0${n}`;
		}
		return n;
	};
	timestamp = timestamp / 1000;
	const hour = Math.floor(timestamp / 3600);
	const minute = Math.floor((timestamp - hour * 3600) / 60);
	const second = Math.floor(timestamp % 60);
	return `${zeroPadding(String(hour))}:${zeroPadding(
		String(minute)
	)}:${zeroPadding(String(second))}`;
};
export const thousandFormatter = (count: number): string => {
	if (count < 10000) {
		return String(count);
	}

	return `${(count / 10000).toFixed(1)}万`;
};
