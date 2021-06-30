import { robots } from "@front/util_function/system";
import {
	robotGetters,
	getContent,
	getUID,
	getDanmakuType
} from "@front/components/danmakuFlow/utils/getter";
import { removePunctuation } from "@front/util_function/base";
const waitList: any = [];
let readObj: any = null;
let reading = false;

export const read = ({
	rtype,
	api,
	speed,
	volume,
	danmaku,
	rules,
	comboReading,
	filters = []
}: any) => {
	let content = "";
	if (!rules) {
		return;
	}
	let contentI = "";
	if (getDanmakuType(danmaku) === 1000) {
		contentI = getContent(danmaku);
		filters.forEach((filter: any) => {
			contentI = contentI.replaceAll(filter, "");
		});
		if (!removePunctuation(contentI).replaceAll(" ", "")) {
			return;
		}
		if (
			comboReading &&
			readObj &&
			getDanmakuType(readObj) === 1000 &&
			getUID(danmaku) === getUID(readObj)
		) {
			content = contentI;
		}
	}
	if (!content) {
		rules.forEach((rule: any) => {
			switch (rule.type) {
				case "text":
					content += rule.value;
					break;
				case "variable":
					if (rule.value === "getContent" && contentI) {
						content += contentI;
					} else {
						// @ts-ignore
						if (robotGetters[rule.value]) {
							// @ts-ignore
							content += robotGetters[rule.value](danmaku);
						}
					}
			}
		});
	}
	if (!content) {
		return;
	}
	const data = {
		rtype,
		api,
		speed,
		volume,
		text: content,
		origin: danmaku
	};
	if (reading) {
		if (waitList.length >= 10) {
			waitList.splice(1);
		}
		waitList.push(data);
	} else {
		realRead(data);
	}
};

export const realRead = (data: any) => {
	reading = true;
	readObj = data.origin;
	let reader: any = robots.default;
	if (data.rtype) {
		// @ts-ignore
		reader = robots[data.rtype] || robots.default;
	}
	reader(data).finally(() => {
		setTimeout(() => {
			reading = false;
			if (waitList[0]) {
				realRead(waitList.splice(0, 1)[0]);
			}
		}, 500);
	});
};
