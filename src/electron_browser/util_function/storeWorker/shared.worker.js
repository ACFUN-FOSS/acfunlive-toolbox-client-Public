/* eslint-disable */
let hostPort = null;
let clients = {};
const HOST = 0,
	CLIENT = 1;
let timer = null;
const randomId = (length = 6) => {
	let Num = "";
	for (let i = 0; i < length; i++) {
		Num += Math.floor(Math.random() * 10);
	}
	return Num;
};

const startTimer = () => {
	clearTimeout(timer);
	requestDatas();
	timer = setTimeout(startTimer, 2000);
}

const requestDatas = () => {
	if (!hostPort) return;
	for (const id in clients) {
		hostPort.postMessage(["requestData", id, ...clients[id].states])
	}
	hostPort.postMessage(["sendUp"])
}

onconnect = function (e) {
	startTimer();
	const port = e.ports[0];
	const id = randomId();
	port.postMessage([`connected!`, ""]);
	port.onmessage = e => {
		const [method, ...data] = e.data;
		switch (method) {
			case "close":
				if (hostPort === port) {
					hostPort = null;
				} else {
					delete clients[id];
				}
				break;
			case "registerHost":
				hostPort = port;
				break;
			case "registerClient":
				clients[id] = {
					port,
					states: data
				};
				break;
			case "responseData":
				const [cid, response] = data;
				if (clients[cid]) {
					clients[cid].port.postMessage(["response", response]);
				}
		}
	};

};
