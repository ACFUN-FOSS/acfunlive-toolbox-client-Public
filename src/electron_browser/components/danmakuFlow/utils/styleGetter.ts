export const size = (style: any): any => {
	const output = {};
	const sizes = ["width", "height"];
	sizes.forEach((size: string) => {
		if (style[size] === undefined) {
			return;
		}

		if (style[size] > 0) {
			// @ts-ignore
			output[size] = `${style[size]}px`;
		}
		if (style[size] < 0) {
			// @ts-ignore
			output[size] = `${-style[size]}%`;
		}
	});
	return output;
};
export const aspectRatio = (style: any): any => {
	const { aspectRatio }: any = style;
	if (aspectRatio) {
		return {
			aspectRatio
		};
	}
	return {};
};
export const padding = (style: any): any => {
	const result: any = {};
	const attrs = [
		"paddingTop",
		"paddingRight",
		"paddingBottom",
		"paddingLeft"
	];
	attrs.forEach((attr: any) => {
		if (style[attr] !== undefined) {
			result[attr] =
				style[attr] > 0 ? `${style[attr]}px` : `${-style[attr]}%`;
		}
	});
	return result;
};
export const margin = (style: any): any => {
	const result: any = {};
	const attrs = ["marginTop", "marginRight", "marginBottom", "marginLeft"];
	attrs.forEach((attr: any) => {
		if (style[attr] !== undefined) {
			result[attr] = `${style[attr]}px`;
		}
	});
	return result;
};
export const border = (style: any): any => {
	return {
		border: `${style.borderWidth}px solid ${style.borderColor}`
	};
};
export const outerBox = (style: any): any => {
	const result: any = {
		overflow: style.overflow,
		borderRadius: `${style.borderRadius}px`,
		verticalAlign: style.verticalAlign,
		background: style.backgroundColor,
		backgroundSize: "100% 100%"
	};
	if (style.backgroundImage) {
		result.background = `url(${style.backgroundImage})`;
	}
	return result;
};
export const degreeColor = (colors: any, degree: number): any => {
	if (!Array.isArray(colors) || !colors.length) {
		return "";
	}
	if (colors.length === 1 || !colors.find((i: any) => degree >= i.level)) {
		return colors[0].color;
	} else {
		return [...colors]
			.sort((a: any, b: any) => {
				return b.level - a.level;
			})
			.find((i: any) => degree >= i.level).color;
	}
};
export const position = (style: any): any => {
	const output: any = {
		position: style.position,
		zIndex: style.zIndex,
		display: ""
	};
	if (output.position === "relativeBlock") {
		output.position = "relative";
		output.display = "block";
	}
	const positions = ["left", "top", "right", "bottom"];
	positions.forEach((position: string) => {
		if (style[position] !== undefined) {
			output[position] =
				style[position] > 0
					? `${style[position]}px`
					: `${-style[position]}%`;
		}
	});
	return output;
};
export const font = (style: any): any => {
	const result: any = {
		fontSize: `${style.fontSize}px`,
		fontWeight: style.fontWeight,
		color: style.color,
		textShadow: `-${style.textShadowWidth}px -${style.textShadowWidth}px 0 ${style.textShadowColor}, 0 -${style.textShadowWidth}px 0 ${style.textShadowColor}, ${style.textShadowWidth}px -${style.textShadowWidth}px 0 ${style.textShadowColor}, ${style.textShadowWidth}px 0 0 ${style.textShadowColor},
		${style.textShadowWidth}px ${style.textShadowWidth}px 0 ${style.textShadowColor}, 0 ${style.textShadowWidth}px 0 ${style.textShadowColor}, -${style.textShadowWidth}px ${style.textShadowWidth}px 0 ${style.textShadowColor}, -${style.textShadowWidth}px 0 0 ${style.textShadowColor}`,
		fontStyle: style.fontStyle,
		textDecoration: style.textDecoration
	};
	if (style.font) {
		let fontName = style.font.match(/[^/]*(?=.ttf)/g);
		if (fontName) {
			fontName = fontName[0];
			if (!document.querySelector(`style#${fontName}`)) {
				const head = document.head;
				const styleEle = document.createElement("style");
				styleEle.id = fontName;
				styleEle.type = "text/css";
				styleEle.appendChild(
					document.createTextNode(`
				@font-face { 
					font-family: "${fontName}"; 
					src: url(${style.font}) format('truetype'); 
				} 
			`)
				);
				head.appendChild(styleEle);
			}
			result.fontFamily = fontName;
		}
	}
	return result;
};

export const transform = (style: any): any => {
	return {
		transform: `rotateZ(${style.rotateZ}deg)`
	};
};
