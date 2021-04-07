class SelfMethods {
	static initCssVar(obj: any, parent: string): any {
		let result: any = {};
		for (const key in obj) {
			if (typeof obj[key] !== "object") {
				result[`${parent}${parent ? "_" : "--"}${key}`] = obj[key];
			} else {
				result = {
					...result,
					...this.initCssVar(
						obj[key],
						`${parent}${parent ? "_" : "--"}${key}`
					)
				};
			}
		}
		return result;
	}

	static async copyText(text: string): Promise<void> {
		await window.navigator.clipboard.writeText(text);
	}

	static unixTimeFormatter(timestamp: number) {
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
	}

	static randomId(length: number) {
		let Num = "";
		for (let i = 0; i < length; i++) {
			Num += Math.floor(Math.random() * 10);
		}
		return Num;
	}

	static isElectron() {
		return Boolean(window && window.process && window.process.type);
	}
}

export default SelfMethods;
