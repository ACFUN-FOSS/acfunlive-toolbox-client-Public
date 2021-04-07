import { app } from "electron";
const { spawn } = require("child_process");
const path = require("path");
class Backend {
	process: any;
	constructor() {
		this.process = null;
	}

	init() {
		const exepath = path.join(process.resourcesPath, "backend.exe");
		// console.log(exepath);
		this.process = spawn(exepath, ["--debug"], {
			windowshide: false,
			shell: false
		});
	}

	kill() {
		if (!this.process) {
			console.log("no process running!!");
			return;
		}
		this.process.kill();
		this.process = null;
	}

	restart() {
		if (!this.process) {
			console.log("no process running!!");
			return;
		}
		this.process.on("close", () => {
			this.process = null;
			this.init();
		});
		this.process.kill();
	}
}

export default new Backend();
