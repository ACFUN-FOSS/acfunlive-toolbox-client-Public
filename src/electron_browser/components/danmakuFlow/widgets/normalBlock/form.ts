import {
	colorF,
	integerF,
	selectF,
	numberF,
	stringF,
	gradientF,
	backgroundImageF,
	fontF
} from "@front/components/danmakuFlow/utils/form";
import style from "@front/datas/styleOptions";
export default () => {
	return {
		type: "object",
		properties: {
			config: {
				type: "object",
				title: "设置",
				properties: {
					text: stringF("自定义文字", "25%")
				}
			},
			style: {
				type: "object",
				title: "样式",
				properties: {
					width: integerF("宽度", "25%"),
					height: integerF("高度", "25%"),
					verticalAlign: selectF(
						"垂直排布",
						style.verticalAlign(),
						"25%"
					),
					rotateZ: integerF("旋转", "25%"),
					position: selectF("定位", style.position(), "25%"),
					zIndex: integerF("层级", "75%"),
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

					font: fontF("字体", "25%"),
					fontSize: integerF("字号", "25%"),
					fontWeight: selectF("字粗", style.fontWeight(), "25%"),
					color: colorF("颜色", "25%"),
					fontStyle: selectF("风格", style.fontWeight(), "25%"),
					textDecoration: selectF(
						"装饰",
						style.textDecoration(),
						"25%"
					),
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
					backgroundColor: gradientF("背景颜色", "25%"),
					backgroundImage: backgroundImageF("背景图片"),
					borderRadius: integerF("边框圆角", "25%"),
					borderWidth: integerF("边框宽", "25%"),
					borderColor: colorF("边框颜色", "25%")
				}
			}
		}
	};
};
