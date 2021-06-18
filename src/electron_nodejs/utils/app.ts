import { ipcMain, App } from "electron";
const qs = require("qs");
class AppTest {
	static registerEvents(app: App) {
		ipcMain.on("getAppMetrics", (event: any) => {
			AppTest.getAppMetrics(event, app);
		});
	}

	static getAppMetrics(event: any, app: App) {
		event.reply(
			"getAppMetrics-complete",
			JSON.stringify({
				list: app.getAppMetrics()
			})
		);
	}
}
export default AppTest;
