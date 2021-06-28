import { typeOptions } from "@front/components/danmakuFlow/utils/data";
export const rules = () => {
	return [
		{
			label: "弹幕类型",
			value: {
				method: "getDanmakuType",
				judges: [include, exclude],
				type: "select",
				options: [typeOptions()],
				default: 1000
			}
		},
		{
			label: "用户名",
			value: {
				method: "getNickName",
				judges: [include, exclude, equal, unequal],
				type: "select-input",
				options: [],
				default: ""
			}
		},
		{
			label: "牌子名",
			value: {
				method: "getMedalName",
				judges: [include, exclude, equal, unequal],
				type: "select-input",
				options: [],
				default: ""
			}
		},
		{
			label: "牌子等级",
			method: "getMedalName",
			judges: [include, exclude, equal, unequal, larger, smaller],
			type: "number",
			options: [],
			default: 0
		},
		{
			label: "礼物名称",
			method: "getGiftName",
			judges: [include, exclude, equal, unequal, larger, smaller],
			type: "select-input",
			options: [],
			default: 0
		},
		{
			label: "礼物价值"
		},
		{
			label: "连击次数"
		},
		{
			label: "单次礼物数量"
		},
		{
			label: "连击礼物总数"
		},
		{
			label: "评论内容"
		},
		{}
	];
};

export const include = {
	label: "包含",
	multi: true,
	value: 0
};

export const exclude = {
	label: "不包含",
	multi: true,
	value: 1
};

export const equal = {
	label: "等于",
	multi: false,
	value: 2
};

export const unequal = {
	label: "不等于",
	multi: false,
	value: 3
};

export const larger = {
	label: "大于",
	multi: false,
	value: 4
};
export const smaller = {
	label: "小于",
	multi: false,
	value: 5
};
