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
				value: ["我爱加班", "我爱加班", "我爱加班", "我爱加班"]
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
					"更新后端稳定性",
					"将端口改为可配置",
					"优化歌回助手",
					"直播数据改为最新网址"
				]
			},
			{
				title: "特别感谢",
				type: "list",
				value: [
					"logo by <a href='https://www.acfun.cn/u/1447414' target='_blank'>木羽熊藏</a>",
					"产品设计：<a href='https://www.acfun.cn/u/173620' target='_blank'>林梦仙</a>",
					"感谢<a href='https://www.acfun.cn/u/1617216' target='_blank'>丶菜籽丶</a>提供代码级样式编辑模板",
					"所有参与测试或提出意见的主播们",
					"感谢不愿透露姓名的网页版数据中心制作者"
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
