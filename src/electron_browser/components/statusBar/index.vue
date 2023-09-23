<template>
	<div
		id="statusBar"
		:class="{ unfold: isUnfold }"
		element-loading-background="rgba(0, 0, 0, 0)"
	>
		<div
			class="switch"
			@click="unfold"
			v-if="streamStatus.step == 'danmakuing'"
		>
			<span class="el-icon-arrow-up" />{{ isUnfold ? "折叠" : "展开" }}
		</div>
		<transition name="fade">
			<component :is="currentComp" />
		</transition>
	</div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { mapState } from "vuex";
import { event } from "@front/util_function/eventBus";
import { registerRole } from "@front/util_function/base";
import { wsevent, allApi } from "@front/api";
import { ElMessage } from "element-plus";
import { chat } from "@front/api/chat";
import { registerHost, closeWorker } from "@front/util_function/storeWorker";
import { load, save } from "@front/util_function/system";
import format from "date-fns/format";
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
		return {
			isUnfold: false,
			clients: {},
			count: 0
		};
	},
	mounted() {
		this.registerEvents();
		this.unfold({
			name: "statusPanel"
		});
	},
	beforeUnmount() {
		this.unregisterEvents();
	},
	computed: {
		...mapState([
			"roomProfile",
			"streamStatus",
			"danmakuProfile",
			"userSession"
		]),
		currentComp(): any {
			return this.isUnfold ? mainPanel : shrink;
		}
	},
	methods: {
		registerEvents() {
			event.on("routeChange", this.unfold);
			event.on("streamStatusChanged", this.handleStatusChange);
			wsevent.on("send-chat", this.sendChat);
			wsevent.on("register-client", this.setWSClient);
			wsevent.on("acfun-api-get", this.sendApi);
			registerHost(this.$store, this.dispatchWSClient);
			registerRole("工具箱");
		},
		unregisterEvents() {
			event.off("routeChange", this.unfold);
			event.off("streamStatusChanged", this.handleStatusChange);
			wsevent.off("send-chat", this.sendChat);
			wsevent.off("register-client", this.setWSClient);
			wsevent.off("acfun-api-get", this.sendApi);
			closeWorker();
		},
		setWSClient({ sourceID, states }: any) {
			const { clients }: any = this;
			clients[sourceID] = states;
		},
		dispatchWSClient() {
			if (!wsevent.registered) {
				this.registerWS();
				return;
			}
			const clients: any = this.clients;
			for (const client in clients) {
				const output: any = {};
				const states = clients[client];
				states.forEach((state: any) => {
					if (["userData"].includes(state)) return;
					output[state] = this.$store.state[state];
				});
				wsevent.wsEmit("server-response", output, client);
			}
			this.$store.commit("cleanChangedDanmaku");
		},
		handleStatusChange() {
			const step = this.streamStatus.step;
			let msg = "";
			switch (step) {
				case "danmakuing":
					msg = "直播已开启";
					this.count++;
					if (this.count > 5) {
						msg += "(获取不到弹幕？试试点击右上角头像重新登陆)";
					}
					this.isUnfold = true;
					this.updateRecordList();
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
		async updateRecordList() {
			let recordList = [];
			try {
				const res: any = await load({ url: "./recordList.json" });
				recordList = JSON.parse(res);
				if (!Array.isArray(recordList)) recordList = [];
			} catch (error) {}
			const liveID = this.$store.state.roomProfile.liveID;
			if (!liveID) return;
			if (!recordList.find((i: any) => i.liveID === liveID)) {
				recordList.unshift({
					liveID,
					time: format(new Date(), "yyyy年MM月dd日 HH:mm:ss")
				});
			}
			save({
				url: "./recordList.json",
				data: recordList
			});
		},
		registerWS() {
			wsevent.register(
				"server",
				this.danmakuProfile?.general?.socket || 4396
			);
		},
		sendApi({ sourceID, method }: any) {
			const apis: any = allApi;
			if (!sourceID || !method || !apis[method]) {
				return;
			}
			apis[method]().then((res: any) => {
				wsevent.wsEmit("acfun-api-res", res, sourceID);
			});
		},
		sendChat({ message }: any) {
			chat({
				userID: this.userSession.userID,
				deviceID: this.userSession.deviceID,
				serviceToken: this.userSession.serviceToken,
				data: {
					visitorId: this.userSession.userID,
					liveId: this.roomProfile.liveID,
					content: message
				}
			});
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

<style scoped lang="scss">
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
