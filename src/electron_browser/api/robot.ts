import { robotRead } from "@front/util_function/system";
import {
	robotGetters,
	getContent
} from "@front/components/danmakuFlow/utils/getter";
import { removePunctuation } from "@front/util_function/base";
const waitList: any = [];

let reading = false;

export const read = ({ speed, volume, danmaku, rules }: any) => {
	let content = "";
	if (!rules) {
		return;
	}
	if (danmaku.type === 1000 && !removePunctuation(getContent(danmaku))) {
		return;
	}
	rules.forEach((rule: any) => {
		switch (rule.type) {
			case "text":
				content += rule.value;
				break;
			case "variable":
				// @ts-ignore
				if (robotGetters[rule.value]) {
					// @ts-ignore
					content += robotGetters[rule.value](danmaku);
				}
		}
	});
	if (!content) {
		return;
	}
	if (reading) {
		if (waitList.length >= 10) {
			waitList.splice(1);
		}
		waitList.push({
			speed,
			text: content
		});
	} else {
		realRead({
			speed,
			volume,
			text: content
		});
	}
};

export const realRead = (data: any) => {
	reading = true;
	robotRead(data).then(() => {
		setTimeout(() => {
			reading = false;
			if (waitList[0]) {
				realRead(waitList.splice(0, 1)[0]);
			}
		}, 500);
	});
};
