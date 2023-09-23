import { ComponentOptionsMixin } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	unixTimeFormatter,
	thousandFormatter
} from "@front/util_function/formatter";
import OBSWebSocket from "obs-websocket-js";
export const closeStream: ComponentOptionsMixin = {
	methods: {
		closeStream() {
			ElMessageBox({
				title: "确认下播？",
				showCancelButton: true,
				confirmButtonText: "确定",
				cancelButtonText: "取消"
			}).then(this.closeStreamConfirmed);
		},
		async closeStreamConfirmed() {
			const { statistic } = this.$store.state.roomStatus;
			const result: any = {};
			Object.keys(statistic).forEach(key => {
				result[key] = thousandFormatter(statistic[key]);
			});
			result.coinCount = thousandFormatter(statistic.diamondCount / 100);
			result.duration = unixTimeFormatter(statistic.duration);
			this.$store
				.dispatch("closeStream", this.$store.state.roomProfile.liveID)
				.finally(async () => {
					// this.$store.commit("stopDanmaku");
					let obsclosed = "";
					const obs = new OBSWebSocket();
					try {
						await obs.connect();
					} catch {
						obsclosed = "OBS未能成功关闭，请手动关闭推流";
					}
					try {
						await obs.call("StopStream");
					} catch (error) {
						console.error(error);
					}
					obs?.disconnect();
					ElMessageBox({
						title: "下播提醒",
						message: `主播辛苦啦！本次直播时长为 ${result.duration ||
							"00:00"},收到点赞数：${
							result.likeCount
						},收到付费礼物数：${result.giftCount}
						（${result.coinCount}AC币）
						,观看总人数${result.watchCount}。${obsclosed}`,
						confirmButtonText: "我知道了"
					});
				});
		}
	}
};
