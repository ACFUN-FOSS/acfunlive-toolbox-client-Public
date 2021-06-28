export const displayType = () => {
	return [
		{
			label: "AC币",
			value: 0,
			converter: (value: any) => {
				return value / 1000;
			}
		},
		{
			label: "RMB",
			value: 1,
			converter: (value: any) => {
				return value / 10000;
			}
		}
	];
};

export const ruleType = () => {
	return [
		{
			label: "按礼物价值(AC币)",
			value: 0
		},
		{
			label: "按礼物类型",
			value: 1
		}
	];
};

export const backgroundType = () => {
	return [
		{
			label: "纯色",
			value: 0
		},
		{
			label: "主题面板",
			value: 1
		}
	];
};
