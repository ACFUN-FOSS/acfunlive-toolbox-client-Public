import { isElectron } from "@front/util_function/electron";
import { ElMessage } from "element-plus";
const { clipboard }: any = isElectron() ? require("electron") : {};

export const copyText = (text: string) => {
	return new Promise(resolve => {
		clipboard.writeText(text);
		resolve(text);
	});
};

export const copy = (text: string) => {
	copyText(text).then(() => {
		ElMessage({
			message: "复制成功",
			duration: 1500,
			type: "success",
			offset: 60
		});
	});
};
