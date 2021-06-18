export class Event {
	events: any = {};
	constructor() {
		this.events = {};
	}

	on(eventName: any, fn: any) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(fn);
	}

	once(eventName: any, fn: any) {
		this.events[eventName] = this.events[eventName] || [];
		const once = () => {
			this.off(eventName, once);
			fn();
		};
		this.events[eventName].push(once);
	}

	off(eventName: any, fn: any) {
		if (this.events[eventName]) {
			for (let i = 0; i < this.events[eventName].length; i++) {
				if (this.events[eventName][i] === fn) {
					this.events[eventName].splice(i, 1);
					break;
				}
			}
		}
	}

	emit(eventName: any, data: any = {}) {
		if (this.events[eventName]) {
			this.events[eventName].forEach((fn: any) => {
				if (fn) fn(data);
			});
		}
	}
}

export const event = new Event();
