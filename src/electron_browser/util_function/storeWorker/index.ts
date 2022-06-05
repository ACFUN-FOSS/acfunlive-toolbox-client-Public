import { Store } from "vuex";
// @ts-ignore
import SharedWorker from "./shared.worker.js";
let _worker: any = null;

export const openWorker = () => {
	if (_worker) {
		// @ts-ignore
		closeWorker();
	}
	_worker = new SharedWorker();
	_worker.port.start();
	window.addEventListener("beforeunload", () => {
		_worker.port.postMessage(["close"]);
	});
	return _worker;
};
export const registerHost = (store: Store<any>, dataCallback: any = null) => {
	const worker = openWorker();
	worker.port.postMessage(["registerHost"]);

	worker.port.onmessage = (e: any) => {
		const [msg, ...attrs] = e.data;

		if (msg === "requestData") {
			const [id, ...states] = attrs;
			const output: any = {};
			states.forEach((state: string) => {
				output[state] = store.state[state];
			});
			worker.port.postMessage([
				"responseData",
				id,
				JSON.stringify(output)
			]);
		}
		if (msg === "sendUp") {
			if (dataCallback instanceof Function) dataCallback(msg, attrs);
		}
	};
};

export const registerClient = (requireArray: Array<any>, callback: any) => {
	const worker = openWorker();
	worker.port.postMessage(["registerClient", ...requireArray]);
	worker.port.onmessage = (e: any) => {
		const [msg, data] = e.data;
		if (msg === "response") {
			callback(JSON.parse(data));
		}
	};
};

export const closeWorker = () => {
	if (!_worker) {
		return;
	}
	_worker.port.postMessage(["close"]);
	_worker.port.close();
	_worker = null;
};
