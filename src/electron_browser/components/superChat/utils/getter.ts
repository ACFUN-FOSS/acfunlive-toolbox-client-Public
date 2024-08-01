import {
	getGiftValue,
	getNickName,
	getAvatar,
	getUID,
	getGiftNumber,
	getContent
} from "@front/components/danmakuFlow/utils/getter";
import {
	superChatBlock,
	SuperChatBlock as SCB,
	SuperChatBlockSetting as SCBS
} from "./data";
import { event } from "@front/util_function/eventBus";
export const getRule = (value: number, rules: Array<SCBS>) => {
	rules.sort((a: any, b: any) => {
		return b.triggerValue - a.triggerValue;
	});
	const ruleIndex = rules.findIndex(
		rule => value / 1000 >= rule.triggerValue
	);
	let nextLevel = 0;
	if (ruleIndex) {
		const nextRule = rules[ruleIndex - 1];
		if (nextRule) {
			nextLevel = nextRule.triggerValue * 1000 - value;
		}
	}
	return {
		rule: rules[ruleIndex],
		nextLevel,
		ruleIndex: rules.length - ruleIndex
	};
};

export const scFromDanmaku = (danmaku: any, ruleData: any): SCB => {
	const timestamp = Date.now();
	const { rule, nextLevel, ruleIndex } = ruleData;
	return {
		...superChatBlock(),
		...rule,
		ruleIndex,
		value: getGiftValue(danmaku),
		number: getGiftNumber(danmaku),
		nickName: getNickName(danmaku),
		avatar: getAvatar(danmaku),
		listEndTime: timestamp + rule.listDuration,
		content: "",
		panelEndTime: 0,
		createTime: timestamp,
		nextLevel,
		uid: getUID(danmaku)
	};
};

export const scAdd = (block: SCB, danmaku: any, rules: Array<SCBS>) => {
	const newValue = getGiftValue(danmaku) + block.value;
	const newNumber = getGiftNumber(danmaku) + block.number;
	const { rule, nextLevel, ruleIndex } = getRule(newValue, rules);
	if (rule && rule.triggerValue > block.triggerValue) {
		block.listEndTime = block.createTime + rule.listDuration;
	}
	block.value = newValue;
	block.number = newNumber;
	block.nextLevel = nextLevel;
	block.panelEndTime += 10000;
	block.ruleIndex = ruleIndex;
	Object.assign(block, rule);
	return block;
};

export const scGiftHandler = (danmaku: any, store: any) => {
	if (!store.getters.superChatEnable) {
		return;
	}
	const superChatSetting = store.state.danmakuProfile.common.superChat;
	const temp = store.state.temp;
	const { rule, nextLevel, ruleIndex } = getRule(
		getGiftValue(danmaku),
		superChatSetting.rules
	);
	if (!rule) {
		return;
	}
	if (getUID(danmaku) === temp.superChatID) {
		temp.superChatBlock = scAdd(
			temp.superChatBlock,
			danmaku,
			superChatSetting.rules
		);
		return;
	}
	const exist = temp.superChatArray.find(
		(scBlock: SCB) => scBlock.uid === getUID(danmaku)
	);
	if (!exist) {
		temp.superChatArray.push(
			scFromDanmaku(danmaku, { rule, nextLevel, ruleIndex })
		);
	} else {
		scAdd(exist, danmaku, superChatSetting.rules);
		temp.superChatArray = [...temp.superChatArray];
	}
	event.emit("super-chat-updated");
};

export const scTextHandler = (danmaku: any, store: any) => {
	const temp = store.state.temp;
	const block = temp.superChatArray.find(
		(b: any) => b.uid === getUID(danmaku)
	);
	if (block) {
		block.content = getContent(danmaku);
		block.panelEndTime += 10000;
	}
};
