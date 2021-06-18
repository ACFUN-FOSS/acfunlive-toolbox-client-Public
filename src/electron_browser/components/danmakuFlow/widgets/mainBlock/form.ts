import {
	colorF,
	integerF,
	selectF,
	numberF,
	gradientF
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
					rotateZ: integerF("旋转", "25%"),
					overflow: selectF(
						"溢出",
						style.overflow().slice(0, 2),
						"25%"
					),
					paddingLeft: integerF("左内边距", "25%"),
					paddingRight: integerF("右内边距", "25%"),
					paddingTop: integerF("上内边距", "25%"),
					paddingBottom: integerF("下内边距", "25%"),
					marginLeft: integerF("左外边距", "25%"),
					marginRight: integerF("右外边距", "25%"),
					marginTop: integerF("上外边距", "25%"),
					marginBottom: integerF("下外边距", "25%"),
					backgroundColor: gradientF("背景颜色", "25%"),
					borderRadius: integerF("边框圆角", "25%"),
					borderWidth: integerF("边框宽", "25%"),
					borderColor: colorF("边框颜色", "25%")
				}
			}
		}
	};
};
