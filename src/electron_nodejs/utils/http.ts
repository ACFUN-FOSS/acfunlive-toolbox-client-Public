import { appStatic, configStatic } from "./paths";
import File from "./file";
const settings = JSON.parse(File.loadConfig(null) || "{}");
export const port =
	settings && settings.general && settings.general.port
		? settings.general.port
		: 1299;
console.log(Object.keys(settings));
export const socket =
	settings && settings.general && settings.general.socket
		? settings.general.socket
		: 4396;
const express = require("express");
const path = require("path");
const his = require("connect-history-api-fallback");
const ip = require("ip");
export const startHttp = () => {
	return new Promise(resolve => {
		const dirname = process.resourcesPath;

		const server = express();

		const { startSocket } = require("./socket.js");
		startSocket(server);
		server.use((req: any, res: any, next: any) => {
			res.header(
				"Cache-Control",
				"private, no-cache, no-store, must-revalidate"
			);
			res.header("Expires", "-1");
			res.header("Pragma", "no-cache");
			next();
		});
		server.use(express.static(appStatic));
		server.use(
			"/configFiles",
			express.static(configStatic, {
				immutable: true
			})
		);
		server.use(
			his({
				disableDotRule: true,
				verbose: true
			})
		);
		server.use(express.static(appStatic));
		server.use(
			"/configFiles",
			express.static(configStatic, {
				immutable: true
			})
		);
		server.get("/", function(req: any, res: any) {
			res.render(path.join(dirname, "/app/index.html"));
		});

		server.listen(port, function() {
			resolve(`http://${ip.address()}:${port}`);
		});
	});
};
