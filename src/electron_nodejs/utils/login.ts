import axios from "axios";
import lodash from "lodash";
const qrLogin = async (req, res) => {
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();
	const _ = lodash.now();
	const result = await axios.get(
		`https://scan.acfun.cn/rest/pc-direct/qr/start?type=WEB_LOGIN&_=${_}`
	);
	const { qrLoginToken, qrLoginSignature } = result.data;

	result.data.imageData = `data:image/png;base64,${result.data.imageData}`;
	res.write("data: " + JSON.stringify(result.data) + "\n\n");
	const scanned = await axios.get(
		`https://scan.acfun.cn/rest/pc-direct/qr/scanResult?qrLoginToken=${qrLoginToken}&qrLoginSignature=${qrLoginSignature}&_=${_}`
	);
	res.write("data: " + JSON.stringify(scanned.data) + "\n\n");
	res.end();
};

const loginMsg = async (req, res) => {
	res.set({
		"Content-Type": "text/plain",
		"Cache-Control": "no-cache"
	});

	const { qrLoginToken, qrLoginSignature, _ } = req.query;

	try {
		const reslt = await axios.get(
			`https://scan.acfun.cn/rest/pc-direct/qr/acceptResult?qrLoginToken=${qrLoginToken}&qrLoginSignature=${qrLoginSignature}&_=${_}`
		);
		res.write(JSON.stringify(reslt.data));
	} catch (error) {
		res.write(
			JSON.stringify({
				msg: "请求错误"
			})
		);
	}
};

export { qrLogin, loginMsg };
