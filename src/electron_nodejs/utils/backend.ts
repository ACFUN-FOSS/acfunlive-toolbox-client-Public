import { ipcMain } from "electron";
import { appStatic, configStatic } from "./paths";
const { spawn } = require("child_process");
const path = require("path");
const find = require("find-process");
const process = require("process");
const fs = require("fs");
let restarting = false;
class Backend {
	static file(): string {
		const platform =
			process.platform === "linux"
				? "linux"
				: process.platform === "darwin"
				? "mac"
				: "win";
		const filename = ["acbackend", platform, process.arch].join("-");
		return process.platform === "win32" ? filename + ".exe" : filename;
	}

	static registerEvents() {
		ipcMain.on("backend_init", Backend.init);
		ipcMain.on("backend_kill", Backend.kill);
		ipcMain.on("backend_restart", Backend.restart);
	}

	static init() {
		const exepath = path.join(
			// @ts-ignore
			__static,
			Backend.file()
		);
		if (process.platform !== "win32") {
			fs.chmodSync(exepath, 0o755);
		}
		const logfile =
			process.platform === "win32"
				? path.join(appStatic, "./../../TellOrzogcWhatHappened")
				: path.join(configStatic, "./TellOrzogcWhatHappened");
		const backend = spawn(exepath, [
			"-logfile",
			logfile,
			"-logversions",
			"10",
			"-tcp"
		]);
		process.on("exit", () => {
			backend.kill();
		});
	}

	static kill() {
		return find("name", "acbackend").then((list: any) => {
			list.forEach((procs: any) => {
				try {
					process.kill(procs.pid);
				} catch (error) {}
			});
		});
	}
	static async restart(event: any) {
		if (restarting) {
			event.reply("restart_complete", "#error");
			return;
		}
		restarting = true;
		Backend.kill()
			.then((list: any) => {
				Backend.init();
				event.reply("restart_complete");
			})
			.catch((e: any) => {
				event.reply("restart_complete", "#error");
				console.log(e);
			})
			.finally(() => {
				restarting = false;
			});
	}
}

export default Backend;
