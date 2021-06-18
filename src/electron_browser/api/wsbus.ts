import { wsPromise, wsStatus } from "@front/api/utils/websocket";
import { Event, event as sysEvent } from "@front/util_function/eventBus";

class WsEvent extends Event {
	registered = false;
	id = "";
	constructor() {
		super();
		sysEvent.on("serve-state-change", (e: boolean) => {
			if (!e) {
				this.registered = false;
				this.emit("unregistered");
			}
		});
	}

	register(id: string) {
		if (!this.checkRegister()) {
			return wsPromise("register", {
				type: 3,
				data: {
					clientID: id
				}
			}).then(() => {
				wsStatus.ws.addEventListener("message", (e: any) => {
					const data = JSON.parse(e.data);
					if (data.type === 5) {
						try {
							if (data.error) {
								throw new Error(data.error);
							}

							const realData = JSON.parse(data.data.message);
							if (realData.sourceID !== this.id) {
								this.emit(realData.event, realData.data);
							}
						} catch (error) {
							console.log(error);
						}
					}
				});
				wsStatus.ws.addEventListener("close", (e: any) => {
					this.registered = false;
				});
				this.registered = true;
				this.id = id;
				this.emit("registered");
			});
		}
		return false;
	}

	reRegister() {
		if (this.id) {
			return this.register(this.id);
		} else {
			console.log("not registered yet!");
			return false;
		}
	}

	checkRegister() {
		if (!this.registered) console.log("unregistered yet!");
		return this.registered;
	}

	wsEmit(eventName: any, data: any = {}, targetID = "") {
		const promise = () => {
			return wsPromise("message-broadcast", {
				type: 4,
				data: {
					clientID: targetID,
					message: JSON.stringify({
						sourceID: this.id,
						event: eventName,
						data
					})
				}
			});
		};
		if (this.checkRegister()) {
			return promise();
		} else {
			this.once("registered", promise);
			return true;
		}
	}
}

export const wsevent = new WsEvent();
