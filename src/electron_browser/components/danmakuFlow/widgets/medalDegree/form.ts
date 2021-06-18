import {
	colorF,
	integerF,
	selectF,
	booleanF,
	numberF,
	stringF,
	fontF,
	degreeF,
	gradientF
} from "@front/components/danmakuFlow/utils/form";
import style from "@front/datas/styleOptions";
export default () => {
	const config = {
		verticalAlign: selectF("垂直排布", style.verticalAlign(), "25%"),
		rotateZ: integerF("旋转", "25%"),
		position: selectF("定位", style.position(), "100%"),
		left: {
			"ui:hidden": "{{parentFormData.position !== 'absolute'}}",
			...integerF("左定位", "25%")
		},
		right: {
			"ui:hidden": "{{parentFormData.position !== 'absolute'}}",
			...integerF("右定位", "25%")
		},
		top: {
			"ui:hidden": "{{parentFormData.position !== 'absolute'}}",
			...integerF("顶部定位", "25%")
		},
		bottom: {
			"ui:hidden": "{{parentFormData.position !== 'absolute'}}",
			...integerF("底部定位", "25%")
		},
		font: fontF("字体", "25%"),
		fontSize: integerF("字号", "25%"),
		fontWeight: selectF("字粗", style.fontWeight(), "25%"),
		specificColor: booleanF("单独设置文字色", "25%"),
		color: {
			...colorF("文字颜色", "25%"),
			"ui:hidden": "{{!parentFormData.specificColor}}"
		},
		fontStyle: selectF("风格", style.fontWeight(), "25%"),
		textDecoration: selectF("装饰", style.textDecoration(), "25%"),
		textShadowWidth: numberF("文字轮廓", "25%"),
		textShadowColor: colorF("阴影颜色", "25%", false),
		paddingLeft: integerF("左内边距", "25%"),
		paddingRight: integerF("右内边距", "25%"),
		paddingTop: integerF("上内边距", "25%"),
		paddingBottom: integerF("下内边距", "25%"),
		marginLeft: integerF("左外边距", "25%"),
		marginRight: integerF("右外边距", "25%"),
		marginTop: integerF("上外边距", "25%"),
		marginBottom: integerF("下外边距", "25%"),
		specificBackgroundColor: booleanF("单独设置背景色", "25%"),
		backgroundColor: {
			...gradientF("背景颜色", "25%"),
			"ui:hidden": "{{!parentFormData.specificBackgroundColor}}"
		},
		borderRadius: integerF("边框圆角", "25%"),
		borderWidth: integerF("边框宽", "25%"),
		specificBorderColor: booleanF("单独设置边框色", "25%"),
		borderColor: {
			...colorF("边框颜色", "25%"),
			"ui:hidden": "{{!parentFormData.specificBorderColor}}"
		}
	};
	return {
		type: "object",
		properties: {
			config: {
				type: "object",
				title: "设置",
				properties: {
					owner: booleanF("只显示主播牌子", "50%"),
					degree: booleanF("等级", "25%"),
					name: booleanF("牌子名", "25%"),
					preview: integerF("等级浏览", "100%"),
					color: {
						...degreeF("通用颜色", "100%"),
						description:
							"通用颜色将会按照等级应用到所有的背景、边框、文字颜色上，除非针对上述颜色进行设置"
					}
				}
			},
			style: {
				type: "object",
				title: "背景样式",
				properties: {
					verticalAlign: selectF(
						"垂直排布",
						style.verticalAlign(),
						"25%"
					),
					rotateZ: integerF("旋转", "25%"),
					position: selectF("定位", style.position(), "100%"),
					left: {
						"ui:hidden":
							"{{parentFormData.position !== 'absolute'}}",
						...integerF("左定位", "25%")
					},
					right: {
						"ui:hidden":
							"{{parentFormData.position !== 'absolute'}}",
						...integerF("右定位", "25%")
					},
					top: {
						"ui:hidden":
							"{{parentFormData.position !== 'absolute'}}",
						...integerF("顶部定位", "25%")
					},
					bottom: {
						"ui:hidden":
							"{{parentFormData.position !== 'absolute'}}",
						...integerF("底部定位", "25%")
					},
					paddingLeft: integerF("左内边距", "25%"),
					paddingRight: integerF("右内边距", "25%"),
					paddingTop: integerF("上内边距", "25%"),
					paddingBottom: integerF("下内边距", "25%"),
					marginLeft: integerF("左外边距", "25%"),
					marginRight: integerF("右外边距", "25%"),
					marginTop: integerF("上外边距", "25%"),
					marginBottom: integerF("下外边距", "25%"),
					specificBackgroundColor: booleanF("单独设置背景色", "25%"),
					backgroundColor: {
						...gradientF("背景颜色", "25%"),
						"ui:hidden":
							"{{!parentFormData.specificBackgroundColor}}"
					},
					borderRadius: integerF("边框圆角", "25%"),
					borderWidth: integerF("边框宽", "25%"),
					specificBorderColor: booleanF("单独设置边框色", "25%"),
					borderColor: {
						...colorF("边框颜色", "25%"),
						"ui:hidden": "{{!parentFormData.specificBorderColor}}"
					}
				}
			},
			degreeStyle: {
				type: "object",
				title: "等级样式",
				"ui:hidden": "{{!rootFormData.config.degree}}",
				properties: config
			},
			nameStyle: {
				type: "object",
				title: "牌子名样式",
				"ui:hidden": "{{!rootFormData.config.name}}",
				properties: config
			}
		}
	};
};
