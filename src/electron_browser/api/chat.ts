import { sendChat } from "@front/util_function/system";
const waitList: any = [];
let sending = false;
export const chat = ({ userID, deviceID, serviceToken, data }: any) => {
	const text = data.content;
	if (!text) {
		return;
	}
	if (sending) {
		waitList.push({ userID, deviceID, serviceToken, data });
	} else {
		realChat({ userID, deviceID, serviceToken, data });
	}
};

export const realChat = (data: any) => {
	sending = true;
	sendChat(data).finally(() => {
		setTimeout(() => {
			sending = false;
			if (waitList[0]) {
				realChat(waitList.shift());
			}
		}, 1000);
	});
};
