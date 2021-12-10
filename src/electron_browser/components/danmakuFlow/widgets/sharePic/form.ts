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
			style: {
				type: "object",
				title: "样式",
				properties: {
					width: integerF("宽度", "25%"),
					height: integerF("高度", "25%"),
					aspectRatio: stringF("宽高比", "25%"),
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
					paddingLeft: integerF("左内边距", "25%"),
					paddingRight: integerF("右内边距", "25%"),
					paddingTop: integerF("上内边距", "25%"),
					paddingBottom: integerF("下内边距", "25%"),
					marginLeft: integerF("左外边距", "25%"),
					marginRight: integerF("右外边距", "25%"),
					marginTop: integerF("上外边距", "25%"),
					marginBottom: integerF("下外边距", "25%"),
					borderRadius: integerF("边框圆角", "25%"),
					borderWidth: integerF("边框宽", "25%"),
					borderColor: colorF("边框颜色", "25%")
				}
			}
		}
	};
};
