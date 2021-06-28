import { defineAsyncComponent } from "vue";

export const stringF = (title: string, width = "25%", others = {}) => {
	return {
		type: "string",
		title,
		"ui:options": {
			size: "mini",
			width
		},
		...others
	};
};
export const booleanF = (title: string, width = "25%", others = {}) => {
	return {
		type: "boolean",
		title,
		"ui:options": {
			size: "mini",
			width
		},
		...others
	};
};
export const integerF = (title: string, width = "25%", others = {}) => {
	return {
		type: "integer",
		title,
		"ui:options": {
			size: "mini",
			width
		},
		...others
	};
};
export const numberF = (title: string, width = "25%", step = 0.1) => {
	return {
		type: "number",
		title,
		"ui:options": {
			size: "mini",
			width
		},
		multipleOf: step
	};
};
export const colorF = (title: string, width = "25%", showAlpha = true) => {
	return {
		type: "string",
		title,
		"ui:options": {
			size: "mini",
			width,
			showAlpha
		},
		format: "color"
	};
};

export const gradientF = (title: string, width = "25%") => {
	return {
		type: "string",
		title,
		"ui:widget": defineAsyncComponent(() =>
			import("@front/components/form/gradientPicker/index.vue")
		),
		"ui:options": {
			size: "mini",
			width
		}
	};
};

export const fontF = (title: string, width = "25%") => {
	return {
		type: "string",
		title,
		"ui:widget": defineAsyncComponent(() =>
			import("@front/components/form/fontPicker/index.vue")
		),
		"ui:options": {
			size: "mini",
			width
		}
	};
};

export const backgroundImageF = (title: string) => {
	return {
		type: "string",
		title,
		"ui:widget": defineAsyncComponent(() =>
			import("@front/components/base/imgInput/imgInputStatic.vue")
		)
	};
};
export const selectF = (title: string, options: Array<any>, width = "25%") => {
	const eNum: any = [];
	const eNumNames: any = [];
	options.forEach((i: any) => {
		if (!i.label) {
			return;
		}
		eNumNames.push(i.label);
		if (i.value !== undefined) {
			eNum.push(i.value);
		} else {
			eNum.push(i.label);
		}
	});
	return {
		type: "string",
		title,
		"ui:options": {
			size: "mini",
			width
		},
		enum: eNum,
		enumNames: eNumNames
	};
};

export const degreeF = (title: string, width = "25%") => {
	return {
		title,
		description: "请按从上到下，等级从小到大顺序添加",
		width,
		type: "array",
		minItems: 1,
		items: {
			type: "object",
			properties: {
				level: {
					...integerF("大于此等级", "25%"),
					default: 0
				},
				color: colorF("显示颜色为", "25%")
			}
		}
	};
};
