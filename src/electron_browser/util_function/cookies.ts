export default class Cookies {
	static set(key: string, value: string): void {
		localStorage.setItem(key, value);
	}

	static get(key: string): string | null {
		return localStorage.getItem(key);
	}
}
