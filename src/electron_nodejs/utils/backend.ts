import { ipcMain } from "electron";
const { spawn } = require("child_process");
const path = require("path");
const find = require("find-process");
const process = require("process");
let restarting = false;
class Backend {
	static registerEvents() {
		ipcMain.on("backend_init", Backend.init);
		ipcMain.on("backend_kill", Backend.kill);
		ipcMain.on("backend_restart", Backend.restart);
	}

	static init() {
		const exepath = path.join(
			// @ts-ignore
			__static,
			"acbackend.exe"
		);
		spawn(exepath, [
			"-logfile",
			"./TellOrzogcWhatHappened",
			"-logversions",
			"10"
		]);
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
