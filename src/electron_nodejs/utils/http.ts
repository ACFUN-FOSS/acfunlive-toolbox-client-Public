import { appStatic, configStatic } from "./paths";
const express = require("express");
const path = require("path");
const his = require("connect-history-api-fallback");
const ip = require("ip");
export const startHttp = () => {
	return new Promise(resolve => {
		const dirname = process.resourcesPath;
		const port = 1188;

		const server = express();

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
