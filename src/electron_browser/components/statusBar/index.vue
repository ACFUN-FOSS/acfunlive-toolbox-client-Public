<template>
	<div id="statusBar" :class="{unfold:isUnfold}" element-loading-background="rgba(0, 0, 0, 0)">
		<div class="switch" @click="unfold" v-if="streamStatus.step=='danmakuing'"><span class="el-icon-arrow-up" />{{isUnfold?'折叠':'展开'}}</div>
		<transition name="fade">
			<component :is="currentComp" />
		</transition>
	</div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { mapState } from "vuex";
import { event } from "@front/util_function/eventBus";
import { wsevent } from "@front/api";
import { ElMessage } from "element-plus";
const mainPanel = defineAsyncComponent(() =>
	import("@front/views/streamMonitor/index.vue")
);
const shrink = defineAsyncComponent(() =>
	import("@front/views/streamMonitor/shrink.vue")
);

export default defineComponent({
	name: "statusBar",
	components: {
		mainPanel,
		shrink
	},
	data() {
		const checkTimeout: any = -1;
		return {
			isUnfold: false,
			checkTimeout
		};
	},
	mounted() {
		event.on("routeChange", this.unfold);
		event.on("streamStatusChanged", this.handleStatusChange);
		wsevent.on("get-session", this.sendSession);
		wsevent.on("get-settings", this.sendSettings);
		this.registerWS();
		this.unfold({
			name: "statusPanel"
		});
	},
	beforeUnmount() {
		event.off("routeChange", this.unfold);
		event.off("streamStatusChanged", this.handleStatusChange);
		wsevent.off("get-session", this.sendSession);
		wsevent.off("get-settings", this.sendSettings);
	},
	computed: {
		...mapState([
			"roomProfile",
			"streamStatus",
			"danmakuProfile",
			"danmakuSession",
			"userSession"
		]),
		currentComp(): any {
			return this.isUnfold ? mainPanel : shrink;
		}
	},
	methods: {
		handleStatusChange() {
			const step = this.streamStatus.step;
			let msg = "";
			switch (step) {
				case "online":
					this.registerWS();
					break;
				case "danmakuing":
					this.registerWS();
					msg = "直播已开启";
					this.isUnfold = true;
					break;
				case "streamEnded":
					msg = "直播已结束";
					this.isUnfold = false;
					break;
				default:
					break;
			}
			if (msg) {
				ElMessage({
					message: msg,
					duration: 1500,
					type: "success",
					offset: 60
				});
			}
		},
		registerWS() {
			wsevent.register("server");
		},
		sendSettings() {
			wsevent.wsEmit("update-settings", {}, "client");
		},
		sendSession() {
			const { userID } = this.userSession;
			wsevent.wsEmit("update-session", { userID }, "client");
		},
		unfold(e: any) {
			if (this.streamStatus.step !== "danmakuing") {
				this.isUnfold = false;
				return;
			}
			if (!e.name) {
				this.isUnfold = !this.isUnfold;
				return;
			}
			this.isUnfold = e.name === "statusPanel";
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
#statusBar {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 1002;
	bottom: 0px;
	transition: all 0.5s;
	transform: translateY(calc(100% - 70px));
	border-top: 1px solid $--color-text-placeholder;
	background-color: $--background-color-base;
	&.unfold {
		// border-color: rgba(0, 0, 0, 0);
		transform: translateY(0px);
		.switch span {
			transform: rotateZ(180deg);
		}
	}
	.switch {
		position: absolute;
		top: 8px;
		right: 25px;
		z-index: 10;
		color: $--color-text-secondary;
		user-select: none;
		cursor: pointer;
		transition: all 0.25s;
		&:hover {
			color: $--color-text-primary;
		}
		span {
			transition: all 0.25s;
		}
	}
}
</style>
