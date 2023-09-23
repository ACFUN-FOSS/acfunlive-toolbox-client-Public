<template>
	<div style="width:100%;height:100%;position:relative">
		<super-chat-list class="super-chat" v-if="superChatEnable" />
		<iframe :class="{ superChatEnable }" class="danmaku-self" :src="url" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { wsevent } from "@front/api";
import { mapState, mapGetters } from "vuex";
import { registerRole, isDev } from "@front/util_function/base";
import { getMockByType } from "@front/views/danmakuSetting/mock/index";
import { loginSession } from "@front/api/user";
import { danmakuGift, danmakuPreHandler } from "@front/store/danmaku/danmaku";
import { commonSettings } from "@/electron_browser/datas/aboutDanmaku";
import superChatList from "@front/components/superChat/index.vue";
export default defineComponent({
	name: "webDanmaku",
	components: { superChatList },
	data() {
		const statusTimer: any = null;
		return {
			statusTimer,
			appID: "danmakuWeb"
		};
	},
	created() {
		this.$store.state.isLogined = true;
		this.registerEvents();
	},
	mounted() {
		this.statusLooper();
		this.updateSettings();
		registerRole("网页端");
	},
	beforeUnmount() {
		this.unRegisterEvents();
	},
	computed: {
		...mapGetters(["superChatEnable"]),
		...mapState([
			"userSession",
			"danmakuProfile",
			"danmakuSession",
			"roomProfile",
			"streamStatus",
			"rank"
		]),
		url() {
			const file = this.$route.query.file || "index.html";
			let link = `${window.location.origin}/configFiles/selfDanmaku/${file}`;
			if (isDev()) link = `${window.location.origin}/liveChat`;
			// @ts-ignore
			return `${link}?liverUID=${this.userSession?.userID}&liveID=${this.roomProfile?.liveID}&clubName=${this.rank.clubName}`;
		}
	},
	methods: {
		updateSettings() {
			fetch("/configFiles/config.json", {
				cache: "no-cache"
			})
				.then((res: any) => res.json())
				.then((json: any) => {
					this.$store.state.danmakuProfile.web = json.web;
					this.$store.state.danmakuProfile.common =
						json.common || commonSettings();
				});
		},
		registerEvents() {
			wsevent.on("sendMockDanmaku", this.setMock);
			wsevent.on("server-response", this.handleResponse);
			wsevent.on("restartDanmaku", this.restartDanmaku);
		},
		unRegisterEvents() {
			wsevent.off("sendMockDanmaku", this.setMock);
			wsevent.off("server-response", this.handleResponse);
			wsevent.off("restartDanmaku", this.restartDanmaku);
		},

		handleResponse(e: any) {
			for (const key in e) this.$store.state[key] = e[key];
			loginSession(e.userSession || {});
		},
		async chechEveryThing() {
			try {
				if (!wsevent.registered) {
					await wsevent.register(
						this.appID,
						this.danmakuProfile?.general?.socket || 4396
					);
				}
				this.subscribeData();
			} catch (error) {
				console.log(error);
			}
			if (
				this.roomProfile.liveID &&
				!["danmakuing", "streaming"].includes(this.streamStatus.step)
			) {
				this.streamStatus.step = "streaming";
				this.$store.dispatch("streaming", this.sendDanmaku);
			}
		},
		subscribeData() {
			wsevent.wsEmit(
				"register-client",
				{
					sourceID: this.appID,
					states: ["userSession", "roomProfile", "rank"]
				},
				"server"
			);
		},
		restartDanmaku() {
			this.$store.dispatch("restartDanmaku");
			(this as any).$message.success({
				message: "重启弹幕中"
			});
		},
		statusLooper() {
			clearInterval(this.statusTimer);
			this.statusTimer = setInterval(() => {
				this.chechEveryThing();
			}, 5000);
		},
		setMock(value: any) {
			const mockDanmaku: any = getMockByType(value);
			this.sendDanmaku(mockDanmaku);
		},
		sendDanmaku(danmaku: any) {
			if (danmaku.type === 1005) {
				danmakuGift(danmaku, this.$store);
			}
			const preHandler = danmakuPreHandler[String(danmaku.type)];
			if (preHandler) {
				preHandler(danmaku, this.$store);
			}
			// @ts-ignore
			document
				.querySelector(".danmaku-self")
				// @ts-ignore
				.contentWindow.postMessage(JSON.stringify(danmaku));
		}
	}
});
</script>
<style lang="scss">
@import "@front/styles/variables.scss";
html,
body,
#app {
	background-color: transparent;
	min-width: 0px;
	min-height: 0px;
	width: 100%;
	height: 100%;
	padding: 0px;
}
#app {
	margin: 0px;
	width: 100%;
	height: 100%;
	transition: none;
}
.danmaku-self {
	width: 100%;
	height: 100%;
	border: none;
	padding-bottom: 16px !important;
}
.superChatEnable {
	height: calc(100% - 40px);
}
.super-chat {
	border: none !important;
	margin-bottom: 5px;
}
</style>
