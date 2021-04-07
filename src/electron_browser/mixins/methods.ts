import { ComponentOptionsMixin } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import sm from "@fe/api/selfMethods";
export const closeStream: ComponentOptionsMixin = {
	methods: {
		async closeStream() {
			const liveDuration = sm.unixTimeFormatter(
				this.$store.state.roomStatus.liveDuration
			);
			await this.$store.commit(
				"closeStream",
				this.$store.state.roomProfile.liveID
			);
			this.$Event.once("liveEnded", () => {
				this.$store.dispatch("checkStreamStatus");
				setTimeout(() => {
					this.$store.commit("getStreamEncodec");
				}, 500);
				ElMessage({
					message: "直播已关闭",
					duration: 1500,
					type: "success",
					offset: 60
				});
				ElMessageBox({
					title: "下播提醒",
					message: `主播辛苦啦！本次直播时长为 ${liveDuration ||
						"00:00"},记得关闭OBS推流哦`,
					confirmButtonText: "我知道了"
				});
			});
		}
	}
};
