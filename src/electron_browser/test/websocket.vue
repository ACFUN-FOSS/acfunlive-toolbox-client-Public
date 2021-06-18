<template>
	<div class="danmaku">
		<el-button @click="sendStyle">style</el-button>
		<el-button @click="sendSettings">settings</el-button>
		<el-button @click="sendDanmaku">danmaku</el-button>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { wsevent, server } from "@front/api";
import { getMock } from "@front/views/danmakuSetting/mock";
export default defineComponent({
	cname: "跨段通信测试",
	name: "alignTest",
	mounted() {
		server.init().then(() => {
			// server.startHeatBeat();
			wsevent.register("server");
		});
	},
	methods: {
		sendStyle() {
			wsevent.wsEmit(
				"update-style",
				this.$store.state.danmakuProfile.web.settingOfType,
				"client"
			);
		},
		sendSettings() {
			wsevent.wsEmit(
				"update-settings",
				this.$store.state.danmakuProfile.web,
				"client"
			);
		},
		sendDanmaku() {
			const danmaku = getMock()[0];
			wsevent.wsEmit("update-danmaku", danmaku, "client");
		}
	}
});
</script>
<style scoped lang='scss'>
</style>
