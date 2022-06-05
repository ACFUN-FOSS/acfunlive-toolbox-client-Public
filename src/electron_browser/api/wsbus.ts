import { Event } from "@front/util_function/eventBus";
import { io, Socket } from "socket.io-client";
import debounce from "lodash/debounce";
class WsEvent extends Event {
	registered = false;
	io: Socket | undefined;
	id = "";
	constructor() {
		super();
		this.id = "";
	}

	register(id: string) {
		this.id = id;
		if (!this.checkRegister()) {
			this.io = io(`http://${window.location.hostname}:4396`, {
				transports: ["websocket", "polling"],
				query: {
					id
				}
			});

			this.io.on("connect", () => {
				this.registered = true;
				this.id = id;
				this.emit("registered");
			});
			this.io.on("transmit", (data: any) => {
				const realData = JSON.parse(data);
				this.emit(realData.event, realData.data);
			});
			const close = () => {
				this.registered = false;
				this.io = undefined;
			};
			this.io.on("reconnect_failed", close);
			this.io.on("reconnect_error", close);
			this.io.on("reconnect_attempt", num => {
				if (num > 10) {
					this.io?.close();
					close();
					this.register(this.id);
				}
			});
		}
		return Promise.resolve();
	}

	checkRegister() {
		if (!this.io) return false;
		return !this.io.disconnected;
	}

	wsEmit(event: any, data: any = {}, to = "") {
		if (!this.io) return;
		this.io.emit(
			"transmit",
			JSON.stringify({
				event,
				from: this.id,
				to,
				data
			})
		);
	}
}

export const wsevent = new WsEvent();
