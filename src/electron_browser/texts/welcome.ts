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
				value: ["魔法画屏", "鸡鸡人2.0", "帮助导览"]
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
					"针对网络不稳定的问题进行优化（反复横跳、弹幕断连、退出迷你化显示未开播等）",
					"增加快速重启按钮（不需要关闭程序）",
					"新增小程序模块",
					"小程序：独立弹幕流、弹幕抽奖、弹幕点歌、弹幕投票、歌回助手、公告机器人、留言板",
					"修复重连有概率卡死电脑的问题（塞壬对不起！）",
					"以及其它一些bug修复"
				]
			},
			{
				title: "特别感谢",
				type: "list",
				value: [
					"logo by <a href='https://www.acfun.cn/u/1447414' target='_blank'>木羽熊藏</a>",
					"产品设计：<a href='https://www.acfun.cn/u/173620' target='_blank'>林梦仙</a>",
					"所有参与测试或提出意见的主播们"
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
