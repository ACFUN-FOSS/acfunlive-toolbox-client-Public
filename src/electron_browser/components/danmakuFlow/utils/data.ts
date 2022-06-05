export const speedOptions = () => {
	return [
		{
			label: "关",
			value: "close"
		},
		{
			label: "慢",
			value: "slow"
		},
		{
			label: "快",
			value: "fast"
		}
	];
};
export const typeOptions = (): any => {
	return [
		{
			label: "评论",
			type: "text",
			value: 1000
		},
		{
			label: "点赞",
			type: "like",
			value: 1001
		},
		{
			label: "进直播间",
			type: "enter",
			value: 1002
		},
		{
			label: "关注",
			type: "subscribe",
			value: 1003
		},
		{
			label: "礼物",
			type: "gift",
			value: 1005
		},
		{
			label: "系统消息",
			type: "richText",
			value: 1006
		},
		{
			label: "加入守护团",
			type: "joinClub",
			value: 1007
		},
		{
			label: "分享直播间",
			type: "joinClub",
			value: 1008
		}
	];
};
export const giftTypeOptions = () => {
	return [
		{
			label: "礼物图片",
			value: "picture"
		},
		{
			label: "礼物名称",
			value: "name"
		},
		{
			label: "价值",
			value: "price"
		},
		{
			label: "数量",
			value: "number"
		}
	];
};
export const styleConfig = (code: any) => {
	const danmakuType = typeOptions().find((i: any) => {
		return i.value === code;
	});
	if (!danmakuType) {
		return {};
	}
	return {
		label: danmakuType.label,
		code,
		type: danmakuType.type,
		widgets: [], // 具体组件样式
		advHtml: "",
		advCss: "",
		advId: ""
	};
};
