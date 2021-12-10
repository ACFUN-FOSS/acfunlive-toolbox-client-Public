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
					"点歌播放器施工中，点歌台暂时下线",
					"重构",
					"重构",
					"还是重构"
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
					"更新‘分享到其它平台’的弹幕类型",
					"房间管理页面新增允许剪辑开关",
					"迷你化现在可自定义背景颜色",
					"直播面板新增剪辑页面快捷入口",
					"修复迷你化宽度问题",
					// "修复点歌台",
					"优化抽奖（现在可以记录奖品及弹幕",
					"继续优化断线重连",
					"以及其它一些bug修复",
					"在重构了 别骂了别骂了"
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
