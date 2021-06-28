import {
	integerF,
	selectF,
	stringF,
	booleanF
} from "@front/components/danmakuFlow/utils/form";
export const schema = () => {
	return {
		type: "object",
		properties: {
			enable: booleanF("开启", "100%"),
			rtype: disableHidden(
				selectF(
					"音源",
					[
						{
							label: "windows自带",
							value: "default"
						},
						{
							label: "科大讯飞",
							value: "kdxf"
						}
					],
					"20%"
				)
			),
			volume: disableHidden({
				...integerF("音量", "20%"),
				minimum: 0,
				maximum: 100
			}),
			speed: disableHidden({
				...integerF("语速", "20%"),
				minimum: 0,
				maximum: 10
			}),
			ignoreOwner: disableHidden(booleanF("忽略主播", "20%")),
			comboReading: disableHidden(booleanF("评论连读", "20%")),
			api: {
				type: "object",
				"ui:hidden":
					"{{!parentFormData.rtype||parentFormData.rtype==='default'}}",
				properties: {
					apiSecret: stringF("api-secret", "25%"),
					appID: stringF("app-ID", "25%"),
					apiKey: stringF("api-key", "25%"),
					voiceName: stringF("角色声音", "25%")
				}
			},
			rules: {
				type: "array",
				"ui:hidden": "{{true}}"
			}
		}
	};
};

export const uiSchema = () => {
	return {
		volume: {
			"ui:widget": "el-slider"
		},
		speed: {
			"ui:widget": "el-slider"
		}
	};
};

const disableHidden = (obj: any) => {
	return {
		"ui:hidden": "{{!parentFormData.enable}}",
		...obj
	};
};
