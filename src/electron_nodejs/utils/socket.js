const { Server } = require("socket.io");
const ip = require("ip");
const clients = {};
const { port, socket } = import("./http.ts");
const isPortFree = port =>
	new Promise(resolve => {
		const server = require("http")
			.createServer()
			.listen(port, () => {
				server.close();
				resolve(true);
			})
			.on("error", () => {
				resolve(false);
			});
	});

const startSocket = async server => {
	if (!(await isPortFree(socket || 4396))) return;
	const httpServe = require("http").createServer(server);
	const address = ip.address();
	const io = new Server(httpServe, {
		cors: {
			origin: [
				`http://${address}:${port || 1299}`,
				`http://${address}:8080`,
				`http://${address}:8081`
			]
		},
		transports: ["websocket", "polling"],
		pingInterval: 1000,
		pingTimeout: 1000 * 60,
		agent: false,
		rejectUnauthorized: false
	});

	io.on("connection", socketI => {
		const { handshake } = socketI;
		if (!handshake || !handshake.query.id) return;
		const id = handshake.query.id;
		if (clients[id]) clients[id].disconnect(true);
		clients[id] = socketI;

		// socket.on("disconnect", () => {
		// 	delete clients.id;
		// });

		socketI.on("transmit", message => {
			const { to } = JSON.parse(message);
			if (to && clients[to]) {
				clients[to].emit("transmit", message);
			}
		});
	});
	httpServe.listen(socket || 4396, () => {
		console.log("socket opened!");
	});
};

module.exports = { startSocket };
