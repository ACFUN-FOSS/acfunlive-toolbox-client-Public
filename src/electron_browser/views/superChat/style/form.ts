import {
	colorF,
	integerF,
	selectF,
	stringF,
	numberF,
	backgroundImageF,
	fontF
} from "@front/components/danmakuFlow/utils/form";
import {
	backgroundType,
	backgroundPosition,
	fontWeight,
	backgroundSizeType
} from "@front/datas/styleOptions";
import { backgroundArray } from "@front/components/superChat/backgrounds";
export default () => {
	return {
		type: "object",
		properties: {
			config: {
				type: "object",
				title: "基础配置",
				properties: {
					text: stringF("初始文字", "100%")
				}
			},
			background: {
				type: "object",
				title: "背景设置",
				properties: {
					backgroundType: selectF(
						"背景类型",
						backgroundType(),
						"50%"
					),
					backgroundColor: {
						"ui:hidden": "{{parentFormData.backgroundType !== 0}}",
						...colorF("背景颜色", "25%")
					},
					backgroundDynamic: {
						"ui:hidden": "{{parentFormData.backgroundType !== 1}}",
						...selectF("动态背景选择", backgroundArray, "50%")
					},
					backgroundImage: backgroundImageF("背景图片"),
					backgroundSizeType: selectF(
						"背景图片填充",
						backgroundSizeType(),
						"50%"
					),
					backgroundSize: {
						"ui:hidden":
							"{{parentFormData.backgroundSizeType !== 0}}",
						...integerF("背景尺寸", "25%")
					},
					backgroundPosition: selectF(
						"图片位置",
						backgroundPosition(),
						"25%"
					),
					backgroundOpacity: integerF("图片透明度", "50%")
				}
			},
			listStyle: {
				type: "object",
				title: "胶囊设置",
				properties: {
					font: fontF("字体", "50%"),
					fontSize: integerF("字号", "25%"),
					fontWeight: selectF("字粗", fontWeight(), "25%"),
					color: colorF("颜色", "25%"),
					textShadowWidth: numberF("文字轮廓", "25%")
				}
			},
			panelStyle: {
				type: "object",
				title: "面板设置",
				properties: {
					font: fontF("字体", "50%"),
					fontSize: integerF("字号", "25%"),
					fontWeight: selectF("字粗", fontWeight(), "25%"),
					color: colorF("颜色", "25%"),
					textShadowWidth: numberF("文字轮廓", "25%")
				}
			}
		}
	};
};
