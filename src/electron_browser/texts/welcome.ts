export const welcome = (): any => {
	return {
		message:
			"感谢支持，祝你在A站玩的开心！使用前一定要看文件夹里的说明！！！准备正式发布啦！撒花~~",
		blocks: [
			{
				title: "Bug报告/反馈建议",
				type: "html",
				value:
					"<a href='https://www.wjx.top/vj/h4Zh8Hc.aspx' target='_blank'>此处</a>提交Bug或反馈"
			},
			{
				title: "近期规划",
				type: "list",
				value: ["superChat", "打赏回复", "帮助导览"]
			},
			{
				title: "最后",
				type: "html",
				value:
					"如果觉得好用可以在<a href='https://github.com/ACFUN-FOSS/acfunlive-toolbox-client-Public' target='_blank'>这里</a>和<a href='https://github.com/ACFUN-FOSS/acfunlive-backend' target='_blank'>这里</a>点个星星支持我们"
			},
			{
				title: "本次更新内容",
				type: "list",
				value: [
					"添加默认设置（样式/表情包默认开启/鸡鸡人规则",
					"优化滚动逻辑",
					"修复礼物数量显示问题",
					"礼物价值现在可以正确显示了",
					"跟换主题",
					"表情包增加防刷屏设置"
				]
			},

			{
				title: "最后的最后",
				type: "string",
				value: "AC在 爱也在"
			}
		]
	};
};
