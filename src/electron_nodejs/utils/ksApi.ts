import { ipcMain } from "electron";
import axios from "axios";
const qs = require("qs");
class KsApi {
	static registerEvents() {
		ipcMain.on("send_chat", this.sentChat);
	}

	static async sentChat(event: any, res: any) {
		try {
			await KsApi.sentChatMessage(res);
			event.reply("send_chat_complete");
		} catch (error) {
			console.log(error);
			event.reply("send_chat_complete", "#error");
		}
	}

	static sentChatMessage(res: any) {
		const { userID, deviceID, serviceToken, data } = JSON.parse(res);
		const url =
			"https://api.kuaishouzt.com/rest/zt/live/web/audience/action/comment?" +
			"subBiz=mainApp&" +
			"kpn=ACFUN_APP&" +
			"kpf=PC_WEB&" +
			`userId=${userID}&` +
			`did=${deviceID}&` +
			`acfun.midground.api_st=${serviceToken}`;
		return axios({
			method: "post",
			url,
			data: qs.stringify(data),
			headers: {
				"content-Type": "application/x-www-form-urlencoded",
				referer: `https://live.acfun.cn/live/${userID}`
			}
		});
	}
}
export default KsApi;
