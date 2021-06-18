import { setTime } from "@/electron_browser/components/danmakuFlow/utils/getter";
import { ipcMain } from "electron";
import { setTimeout } from "timers";
const { spawn } = require("child_process");
const path = require("path");
const find = require("find-process");
const process = require("process");

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
		spawn(exepath, ["-logfile", "./TellOrzogcWhatHappened"]);
	}

	static kill() {
		find("name", "acbackend").then((list: any) => {
			list.forEach((procs: any) => {
				process.kill(procs.pid);
			});
		});
	}
	static restart() {
		find("name", "acbackend").then((list: any) => {
			list.forEach((procs: any) => {
				process.kill(procs.pid);
			});
			Backend.init();
		});
	}
}

export default Backend;
