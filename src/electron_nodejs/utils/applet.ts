import { ipcMain } from "electron";
import MainWin from "./mainwin";
import { shell } from "electron";
import File from "./file";
import { appStatic, isDev } from "./paths";
const path = require("path");
const fs = require("fs");
class Applets {
	static running: any = {};
	static registerEvents() {
		ipcMain.on("startApplet", Applets.init);
		ipcMain.on("appletList", Applets.list);
	}

	static init(event: any, data: any) {
		const { name, configurations, path } = JSON.parse(data);
		if (!configurations.multiple && Applets.running[name]) {
			const { win } = Applets.running[name];
			if (win.isMinimized()) win.restore();
			win.focus();
			return;
		}
		const win = MainWin.newWindow(configurations);
		win.once("ready-to-show", () => {
			win.show();
			// win.webContents.openDevTools();
		});
		win.webContents.on("new-window", function(e, url) {
			e.preventDefault();
			shell.openExternal(url);
		});
		win.on("close", () => {
			if (configurations.multiple && Applets.running[name]) {
				Applets.running[name] = Applets.running[name].filter(
					(wn: any) => win.webContents.id !== wn.win.webContents.id
				);
			} else {
				Applets.running[name] = null;
			}
		});
		const ip = require("ip");
		let url: any = `${
			isDev
				? <string>process.env.WEBPACK_DEV_SERVER_URL
				: `http://${ip.address()}:1299`
		}/applets`;
		url = new URL(url);
		url += `?name=${encodeURIComponent(name)}&path=${encodeURIComponent(
			path
		)}&configurations=${encodeURIComponent(data)}`;
		win.loadURL(url).then(() => {
			win.title = `小程序${name}`;
		});
		if (isDev) win.webContents.openDevTools();
		MainWin.registerEvents(win);
		const output = {
			name,
			win
		};
		if (configurations.multiple) {
			Applets.running[name]
				? Applets.running[name].push(output)
				: (Applets.running[name] = [output]);
		} else {
			Applets.running[name] = {
				name,
				win
			};
		}
	}

	static async list(event: any) {
		const rootPath = path.join(appStatic, "applets");
		const files = File.getFileList({}, JSON.stringify({ url: rootPath }));
		// console.log(files);
		const result: any = [];
		for (const filePath of files) {
			const target = path.join(rootPath, filePath, "index.vue");
			const targetJson = path.join(rootPath, filePath, "config.json");
			if (!fs.existsSync(target) || !fs.existsSync(targetJson)) continue;
			const obs = path.join(rootPath, filePath, "obs.vue");
			const configurations = JSON.parse(
				fs.readFileSync(targetJson, "utf8")
			);
			if (fs.existsSync(obs)) {
				configurations.obsPath = path.join(
					"/applets",
					filePath,
					"obs.vue"
				);
				if (!configurations.tags) configurations.tags = [];
				configurations.tags.push("OBS投射");
			}
			configurations.path = path.join("/applets", filePath, "index.vue");
			result.push(configurations);
		}
		event.reply("applet_list_complete", JSON.stringify(result));
	}
}

export default Applets;
