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
					"鸡鸡人接入科大讯飞（略麻烦",
					"超级聊(superchat及其动态背景",
					"修正风怒问题！修正风怒问题！修正风怒问题！（应该",
					"修正鸡鸡人读部分纯表弹幕的问题",
					"封面裁剪功能",
					"置顶功能优化",
					"迷你模式下快捷回复功能（ctrl+F2",
					"ac号大小写问题修复",
					"右键点击弹幕菜单新增用户资料入口"
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
