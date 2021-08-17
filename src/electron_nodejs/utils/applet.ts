import { ipcMain } from "electron";
import MainWin from "./mainwin";
import { shell } from "electron";

class Applets {
	static running: any = {};
	static registerEvents() {
		ipcMain.on("startApplet", Applets.init);
	}

	static init(event: any, data: any) {
		const { name, cname, configurations } = JSON.parse(data);
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
		if (process.env.WEBPACK_DEV_SERVER_URL) {
			// Load the url of the dev server if in development mode
			win.loadURL(
				`${<string>process.env.WEBPACK_DEV_SERVER_URL}applets/${name}`
			).then(() => {
				win.title = `小程序${cname || name}`;
			});
			if (!process.env.IS_TEST) win.webContents.openDevTools();
		} else {
			const ip = require("ip");
			win.loadURL(`http://${ip.address()}:1188/applets/${name}`).then(
				() => {
					win.title = `小程序${cname || name}`;
				}
			);
		}
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
}

export default Applets;
