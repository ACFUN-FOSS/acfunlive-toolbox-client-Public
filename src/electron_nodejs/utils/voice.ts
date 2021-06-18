import { ipcMain } from "electron";
const { exec } = require("child_process");

class Voice {
	static registerEvents() {
		ipcMain.on("send_voice", this.sendVoice);
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
}
export default Voice;
