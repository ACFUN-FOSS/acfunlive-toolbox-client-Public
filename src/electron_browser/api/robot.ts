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
	let contentArray = [];
	if (!rules) {
		return;
	}
	let content = getContent(danmaku);
	if (content) {
		filters.forEach((filter: any) => {
			content = content.replaceAll(filter, "");
		});
		if (!removePunctuation(content).replaceAll(" ", "")) {
			return;
		}
		danmaku.data.content = content;
	}
	if (
		content &&
		comboReading &&
		readObj &&
		getDanmakuType(readObj) === 1000 &&
		getUID(danmaku) === getUID(readObj)
	) {
		contentArray.push(content);
	} else {
		let temp = "";
		rules.forEach((rule: any) => {
			switch (rule.type) {
				case "text":
					temp += rule.value;
					break;
				case "variable":
					// @ts-ignore
					if (robotGetters[rule.value]) {
						// @ts-ignore
						temp += robotGetters[rule.value](danmaku);
					}
					break;
				case "voice":
					contentArray.push(...[temp, rule.value]);
					temp = "";
			}
		});
		if (temp) contentArray.push(temp);
	}
	contentArray = contentArray.filter(i => i);
	if (!contentArray[0]) {
		return;
	}
	const data = {
		rtype,
		api,
		speed,
		volume,
		text: "",
		queue: contentArray,
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

export const realRead = async (data: any) => {
	reading = true;
	readObj = data.origin;
	let reader: any = robots.default;
	if (data.rtype) {
		// @ts-ignore
		reader = robots[data.rtype] || robots.default;
	}
	if (data.rtype === "kdxf") {
		for (const index in data.queue) {
			const text = data.queue[index];
			if (!text.includes(".mp3")) {
				try {
					console.log(text);
					const url = await robots.kdxf({
						...data,
						text
					});
					console.log(index, url);
					data.queue[index] = url;
				} catch (error) {}
			}
		}
	}

	for (const item of data.queue) {
		try {
			if (item.includes(".mp3")) {
				await robots.urlRead({ url: item, ...data });
			} else {
				const param = {
					...data,
					text: item
				};
				await reader(param);
			}
		} catch (error) {
			console.log(error);
		}
	}
	setTimeout(() => {
		reading = false;
		if (waitList[0]) {
			realRead(waitList.splice(0, 1)[0]);
		}
	}, 500);
};
