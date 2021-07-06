export const welcome = (): any => {
	return {
		message:
			"感谢支持，祝你在A站玩的开心！有问题/想要的功能请及时站内私信或在下方链接反馈",
		blocks: [
			{
				title: "Bug报告/反馈建议",
				type: "html",
				value:
					"<a href='https://www.wjx.top/vj/h4Zh8Hc.aspx' target='_blank'>此处</a>提交Bug或反馈"
			},
			{
				title: "未来规划",
				type: "list",
				value: [
					"魔法画屏",
					"鸡鸡人2.0",
					"点歌鸡（QQ音乐/网易云",
					"帮助导览"
				]
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
					"新的logo by <a href='https://live.acfun.cn/live/1447414' target='_blank'>木羽熊藏</a>",
					"为适应a站接口变更紧急更新",
					"网页端成功启动后会有示例弹幕",
					"特别关心功能（直播、下播和进入直播间会提醒",
					"增加日志监控",
					"修复登出无法再登录的问题",
					"修复样式保存出错的问题"
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
