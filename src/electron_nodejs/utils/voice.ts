import { ipcMain } from "electron";
import { configStatic } from "./paths";
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
class Voice {
	static registerEvents() {
		ipcMain.on("send_voice", this.sendVoice);
		ipcMain.on("send_xfvoice", this.sendXFVoice);
	}

	static sendVoice(event: any, data: string) {
		const { speed, text, volume } = JSON.parse(data);
		exec(
			`powershell.exe Add-Type -AssemblyName System.speech; $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; $speak.SetOutputToDefaultAudioDevice();  $speak.Rate = ${speed}; $speak.Volume = ${volume};  $speak.Speak('${text}'); exit`,
			(e: any) => {
				if (e) {
					event.reply("voice_complete", "#error");
					return;
				}
				event.reply("voice_complete");
			}
		);
	}

	static sendXFVoice(event: any, data: string) {
		try {
			const { api, speed, text, volume }: any = JSON.parse(data);
			const { apiSecret, appID, apiKey, voiceName }: any = api;
			const WebSocket = require("ws");
			const CryptoJS = require("crypto-js");
			const btoa = require("btoa");
			const utf8 = require("utf8");

			const host = "tts-api.xfyun.cn";
			const link = `wss://${host}/v2/tts`;
			const date = new Date().toUTCString();
			const signature_sha = CryptoJS.enc.Base64.stringify(
				CryptoJS.HmacSHA256(
					`host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`,
					apiSecret
				)
			);
			const authorization = btoa(
				`api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature_sha}"`
			);
			const requestUrl = `authorization=${encodeURIComponent(
				authorization
			)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(
				host
			)}`;

			const client = new WebSocket(`${link}?${requestUrl}`);
			const b64buffer: any = [];
			client.onopen = () => {
				const common = {
					app_id: appID
				};
				const business = {
					aue: "lame",
					sfl: 1,
					vcn: voiceName,
					speed: speed * 10,
					volume: volume,
					pitch: 50,
					tte: "UTF8"
				};
				const data = {
					text: btoa(utf8.encode(text)),
					status: 2
				};

				client.send(
					JSON.stringify({
						common,
						business,
						data
					})
				);
			};
			client.onmessage = (e: any) => {
				console.log(e);
				const data = JSON.parse(e.data);
				if (data.data && data.data.audio) {
					b64buffer.push(Buffer.from(data.data.audio, "base64"));
					if (data.data.status === 2) {
						fs.writeFileSync(
							path.join(configStatic, "voice.mp3"),
							Buffer.concat(b64buffer)
						);
						client.close();
						event.reply(
							"xfvoice_complete",
							`/configFiles/voice.mp3`
						);
					}
				}
			};
			client.onerror = (e: Error) => {
				throw e;
			};
		} catch (error) {
			console.log(error);
			event.reply("xfvoice_complete", `#error`);
		}
	}
}
export default Voice;
