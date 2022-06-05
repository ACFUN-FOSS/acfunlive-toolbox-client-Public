export default class Cookies {
	static set(key: string, value: any, ttl = 259200000): void {
		localStorage.setItem(
			key,
			JSON.stringify({
				value,
				expiry: new Date().getTime() + ttl
			})
		);
	}

	static get(key: string): any | null {
		try {
			const { expiry, value }: any = JSON.parse(
				localStorage.getItem(key) || ""
			);
			if (expiry > new Date().getTime()) return value;
			localStorage.removeItem(key);
			return null;
		} catch (error) {
			return null;
		}
	}
}
