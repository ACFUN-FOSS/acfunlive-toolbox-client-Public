<template>
	<div class="shotcut">
		<row-frame width="100%" title="快捷功能" :flex="true">
			<row-span :span="2.5" style="margin-bottom:8px">
				<a style="text-decoration:none;color:white" :href="`https://live.acfun.cn/live/${userSession.userID}`"
					target="_blank">
					<el-button type="primary" size="mini">直播间</el-button>
				</a>
			</row-span>
			<row-span :span="2" style="margin-bottom:8px">
				<el-button type="primary" size="mini" @click="closeStream">下播</el-button>
			</row-span>
			<row-span :span="2.5" style="margin-bottom:8px">
				<el-button type="primary" size="mini" @click="$store.commit('minify')">迷你化</el-button>

			</row-span>
			<row-span :span="3" style="margin-bottom:8px">
				<el-button type="primary" size="mini" @click="toCut">剪辑入口</el-button>

			</row-span>
			<row-span :span="3" style="margin-bottom:8px">
				<el-button type="primary" size="mini" @click="$store.dispatch('restartDanmaku')">重连弹幕</el-button>

			</row-span>
			<row-span :span="3" style="margin-bottom:8px">
				<el-button type="primary" size="mini" @click="restartDanmakuWeb">重连网页弹幕</el-button>

			</row-span>
		</row-frame>

	</div>

</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { closeStream } from "@front/mixins/methods";
import { toCut } from "@front/api/room";
import { wsevent } from "@front/api/wsbus";
export default defineComponent({
	name: "shotcut",
	mixins: [closeStream],
	data() {
		return {};
	},
	computed: {
		...mapState(["userSession"])
	},
	watch: {},
	methods: {
		toCut() {
			const { roomProfile } = this.$store.state;
			const { liveID } = roomProfile;
			const { userID: liverUID } = this.userSession;
			toCut(liverUID, liveID).then(res => {
				if (!res.url) return;
				window.open(res.redirectURL, "_blank");
			});
		},
		restartDanmakuWeb() {
			wsevent.wsEmit("restartDanmaku", {}, "danmakuWeb");
		}
	}
});
</script>
<style lang="scss" scoped>
</style>
