import { ipcMain } from "electron";
import { appStatic, configStatic } from "./paths";
import { zipTo, zipFrom } from "./zip";
import { randomId } from "./../../electron_browser/util_function/base";
const path = require("path");
const fs = require("fs");
const ba64 = require("ba64");
const spawn = require("child_process").spawn;
class File {
	static registerEvents() {
		ipcMain.on("backend_launch", this.launch);
		ipcMain.on("backend_save", this.savePath);
		ipcMain.on("backend_load", this.loadPath);
		ipcMain.on("backend_load_config", this.loadConfig);
		ipcMain.on("backend_save_config", this.saveConfig);
		ipcMain.on("backend_load_superchat", this.loadSuperChat);
		ipcMain.on("backend_save_superchat", this.saveSuperChat);
		ipcMain.on("backend_copy", this.copyFile);
		ipcMain.on("backend_save_b64", this.saveB64);
		ipcMain.on("backend_font_list", this.getFontList);
		ipcMain.on("save_backup", this.saveBackup);
		ipcMain.on("load_backup", this.loadBackup);
	}

	static launch(event: any, p: any) {
		try {
			spawn(p, [], {
				cwd: path.dirname(p),
				detached: true
			});
		} catch (error) {}
	}

	static async saveBackup(event: any) {
		const zipDir = path.join(appStatic, "backup.zip");
		try {
			await zipTo(configStatic, zipDir);
			event.reply("save_backup_complete", "/backup.zip");
		} catch (error) {
			event.reply("save_backup_complete", "#error");
		}
	}

	static async loadBackup(event: any, p: any) {
		try {
			await zipFrom(p, configStatic);
			const config = File.loadFile(
				path.join(configStatic, "./config.json")
			);
			event.reply("load_backup_complete", config);
		} catch (error) {
			event.reply("load_backup_complete", "#error");
		}
	}

	static loadFile(url: string) {
		try {
			const data = fs.readFileSync(url, "utf8");
			return data;
		} catch (error) {
			return "#error";
		}
	}

	static saveFile(url: string, data: any) {
		fs.writeFile(url, JSON.stringify(data), (err: any) => {
			if (err) {
				console.error(err);
			}
		});
	}

	static copyFile(event: any, res: any) {
		let { srcUrl, distUrl } = JSON.parse(res);
		if (!path.isAbsolute(srcUrl)) srcUrl = path.join(configStatic, distUrl);
		if (!path.isAbsolute(distUrl)) {
			distUrl = path.join(configStatic, distUrl);
		}
		fs.mkdirSync(path.dirname(distUrl), { recursive: true });
		fs.copyFile(srcUrl, distUrl, 0, (err: any) => {
			event.reply("copy_file_complete", err ? "#error" : distUrl);
		});
	}

	static saveB64(event: any, b64: any) {
		const imgPath = path.join(configStatic, `/images/`);
		const imgName = `image${randomId(8)}`;
		try {
			fs.accessSync(imgPath);
		} catch (error) {
			fs.mkdirSync(imgPath, { recursive: true });
		}
		try {
			ba64.writeImageSync(imgPath + imgName, b64);
			event.reply("save_b64_complete", imgPath + imgName + ".png");
		} catch (error) {
			event.reply("save_b64_complete", "#error");
		}
	}

	static loadConfig(event: any) {
		// @ts-ignore
		let url = path.join(configStatic, "config.json");
		try {
			fs.accessSync(url);
		} catch (error) {
			// @ts-ignore
			fs.copyFileSync(path.join(__static, "default.json"), url, 0);
		}
		event.reply("load_config_complete", File.loadFile(url));
	}

	static saveConfig(event: any, res: any) {
		const data = JSON.parse(res);
		// @ts-ignore
		const url = path.join(configStatic, "config.json");
		File.saveFile(url, data);
	}

	static loadSuperChat(event: any) {
		// @ts-ignore
		let url = path.join(configStatic, "superchat.json");
		try {
			fs.accessSync(url);
			event.reply("load_superchat_complete", File.loadFile(url));
		} catch (error) {
			// @ts-ignore
			event.reply("load_superchat_complete", "#error");
		}
	}

	static saveSuperChat(event: any, res: any) {
		const data = JSON.parse(res);
		// @ts-ignore
		const url = path.join(configStatic, "superchat.json");
		File.saveFile(url, data);
	}

	static loadPath(event: any, res: any) {
		let { url } = JSON.parse(res);
		if (!path.isAbsolute(url)) {
			url = path.join(process.resourcesPath, url);
		}
		event.reply("load_complete", File.loadFile(url));
	}

	static savePath(event: any, res: any) {
		let { url, data } = JSON.parse(res);
		if (!path.isAbsolute(url)) {
			url = path.join(process.resourcesPath, url);
		}
		File.saveFile(url, data);
	}
	static getFontList(event: any) {
		// @ts-ignore
		const defaultPath = path.join(__static, "/fonts");
		const userDataPath = path.join(configStatic, "/fonts");
		try {
			fs.accessSync(userDataPath);
		} catch (error) {
			fs.mkdirSync(userDataPath, { recursive: true });
		}
		const result: any = [];
		fs.readdirSync(defaultPath).forEach((file: any) => {
			result.push({
				label: path.parse(file).name,
				value: `/fonts/${path.basename(file)}`
			});
		});
		fs.readdirSync(userDataPath).forEach((file: any) => {
			result.push({
				label: path.parse(file).name,
				value: `/configFiles/fonts/${path.basename(file)}`
			});
		});
		event.reply(
			"font_list_complete",
			JSON.stringify({
				list: result
			})
		);
	}
}
export default File;
