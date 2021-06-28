const baseUrl =
	process.env.NODE_ENV === "production"
		? window.location.hostname
		: "localhost";

export const wsStatus: any = {
	url: `ws://${baseUrl}:15368`,
	ws: null,
	timeout: 5000,
	online: false
};

export const wsPromise = (
	method: string,
	data: any = {},
	timeoutD = 5000
): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!wsStatus.ws || wsStatus.ws.readyState !== 1) {
			reject(new Error("serve not started!"));
			return;
		}
		const timeout = setTimeout(() => {
			wsStatus.ws.removeEventListener("message", judge);
			reject(new Error(`${method} timeout!`));
		}, timeoutD);
		const judge = (e: any) => {
			const data = JSON.parse(e.data);
			if (data.requestID === method) {
				if (data.result === 13) {
					reject(new Error(data.error));
					return;
				}
				if (data.error) {
					reject(new Error(data.error));
				}
				if (data.type !== 1) {
					console.log(`======res===${method}=====`);
					console.log(data);
				}
				clearTimeout(timeout);
				resolve(data.data);
				wsStatus.ws.removeEventListener("message", judge);
			}
		};
		wsStatus.ws.addEventListener("message", judge);
		console.log(`======send===${method}=====`);
		console.log(data);
		wsStatus.ws.send(
			JSON.stringify({
				...data,
				requestID: method
			})
		);
	});
};
