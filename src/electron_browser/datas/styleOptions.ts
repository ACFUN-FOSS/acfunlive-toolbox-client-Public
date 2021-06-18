export const verticalAlign = (): any => {
	return [
		{
			label: "顶端",
			value: "top"
		},
		{
			label: "中间",
			value: "middle"
		},
		{
			label: "底端",
			value: "bottom"
		}
	];
};

export const fontWeight = (): any => {
	return [
		{
			label: "细",
			value: "lighter"
		},
		{
			label: "正常",
			value: "normal"
		},
		{
			label: "粗",
			value: "bold"
		},
		{
			label: "更粗",
			value: "bolder"
		}
	];
};
export const fontStyle = (): any => {
	return [
		{
			label: "正常",
			value: "normal"
		},
		{
			label: "斜体",
			value: "italic"
		},
		{
			label: "反斜",
			value: "oblique"
		}
	];
};

export const textDecoration = (): any => {
	return [
		{
			label: "无",
			value: "none"
		},
		{
			label: "下划线",
			value: "underline"
		},
		{
			label: "上划线",
			value: "overline"
		},
		{
			label: "横划线",
			value: "line-through"
		}
	];
};

export const overflow = (): any => {
	return [
		{
			label: "显示",
			value: "visible"
		},
		{
			label: "隐藏",
			value: "hidden"
		},
		{
			label: "滚动",
			value: "scroll"
		}
	];
};

export const position = (): any => {
	return [
		{
			label: "不定位",
			value: ""
		},
		{
			label: "相对定位",
			value: "relative"
		},
		{
			label: "绝对定位",
			value: "absolute"
		}
	];
};
export default {
	verticalAlign,
	fontWeight,
	fontStyle,
	textDecoration,
	overflow,
	position
};
