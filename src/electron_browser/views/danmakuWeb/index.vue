<template>
	<div style="width:100%;height:100%;position:relative">
		<super-chat-list class="super-chat" v-if="superChatEnable" />
		<flow
			:class="{ superChatEnable }"
			:settings="danmakuProfile.web"
			:danmakuList="flow"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { wsevent } from "@front/api";
import { commonSettings } from "@/electron_browser/datas/aboutDanmaku";
import { tempInfo } from "@front/datas/temp";
import flow from "@front/components/danmakuFlow/index.vue";
import { mapState, mapGetters } from "vuex";
import superChatList from "@front/components/superChat/index.vue";
import { registerRole } from "@front/util_function/base";
import { getMockByType } from "@front/views/danmakuSetting/mock/index";
import { loginSession } from "@front/api/user";
export default defineComponent({
	name: "webDanmaku",
	components: {
		flow,
		superChatList
	},
	data() {
		const statusTimer: any = null;
		const mock: any = [];
		return {
			statusTimer,
			settingTimer: false,
			reconnect: false,
			appID: "danmakuWeb",
			mock
		};
	},
	created() {
		this.$store.state.isLogined = true;
		this.registerEvents();
		this.updateSettings();
	},
	mounted() {
		this.statusLooper();
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
			"streamStatus"
		]),
		flow() {
			const { filterFlow }: any = this.danmakuSession;
			const mock: Array<any> = this.mock;
			if (!filterFlow.length) {
				return [
					...mock,
					{
						mock: true,
						liverUID: 23682490,
						type: 1000,
						data: {
							danmuInfo: {
								sendTime: 1618750176864,
								userInfo: {
									userID: 1,
									nickname: "ACFUN前后端开源⑨课",
									avatar:
										"https://tx-free-imgs.acfun.cn/FllI0yyjNgQ61QdJJdbIh9cRQIYY?imageMogr2/auto-orient/format/webp/quality/75!/ignore-error/1",
									medal: {
										uperID: 23682490,
										userID: 1,
										clubName: "ACER",
										level: 999
									},
									managerType: 0
								}
							},
							content: "弹幕流启动成功！尚未发现弹幕"
						}
					}
				];
			}
			return filterFlow;
		}
	},
	methods: {
		registerEvents() {
			wsevent.on("update-style", this.updateSettings);
			wsevent.on("sendMockDanmaku", this.setMock);
			wsevent.on("sendDanmaku", this.sendDanmaku);
			wsevent.on("server-response", this.handleResponse);
			wsevent.on("requireRegister", this.subscribeData);
		},
		unRegisterEvents() {
			wsevent.off("update-style", this.updateSettings);
			wsevent.off("sendMockDanmaku", this.setMock);
			wsevent.off("server-response", this.handleResponse);
			wsevent.off("requireRegister", this.subscribeData);
		},
		sendDanmaku(danmaku: any) {
			this.$store.commit("addNewDanmaku", danmaku);
		},
		handleResponse(e: any) {
			for (const key in e) this.$store.state[key] = e[key];
			loginSession(e.userSession || {});
		},
		async chechEveryThing() {
			try {
				await wsevent.register(
					this.appID,
					this.danmakuProfile?.general?.socket || 4396
				);
				this.subscribeData();
			} catch (error) {
				console.log(error);
			}
		},
		subscribeData() {
			wsevent.wsEmit(
				"register-client",
				{
					sourceID: this.appID,
					states: ["userSession", "roomProfile"]
				},
				"server"
			);
		},
		statusLooper() {
			clearInterval(this.statusTimer);
			this.statusTimer = setInterval(() => {
				this.chechEveryThing();
			}, 10000);
		},
		updateSettings() {
			if (this.settingTimer) {
				return;
			}
			this.settingTimer = true;
			fetch("/configFiles/config.json", {
				cache: "no-cache"
			})
				.then((res: any) => res.json())
				.then((json: any) => {
					json.web.filter = json.toolBox.filter;
					this.$store.state.danmakuProfile.web = json.web;
					this.$store.state.danmakuProfile.common =
						json.common || commonSettings();
					this.$store.state.temp = tempInfo();
				})
				.finally(() => {
					this.settingTimer = false;
				});
		},
		setMock(value: any) {
			const mockDanmaku: any = getMockByType(value);
			this.mock.unshift(mockDanmaku);
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
.danmaku-flow {
	padding-bottom: 16px !important;
}
.superChatEnable {
	height: calc(100% - 40px);
}
.super-chat {
	border: none !important;
	margin-bottom: 5px;
}
.tips {
	position: absolute;
	width: 100%;
	height: 100%;
	color: white;
	background-color: rgba(0, 0, 0, 0.5);
	font-weight: 700;
	font-size: 24px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	.title {
		font-size: 32px;
		margin-bottom: 15px;
		margin-left: 50px;
		white-space: nowrap;
	}
	.checkers {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		.failed {
			color: $--color-danger;
		}
		.success {
			color: $--color-success;
		}
		.label {
			width: 150px;
		}
	}
	.positioner {
		position: absolute;
		border-style: solid;
		border-color: white;
		height: 5%;
		width: 5%;

		&.lt {
			top: 0px;
			left: 0px;
			border-width: 5px 0px 0px 5px;
		}
		&.rt {
			top: 0px;
			right: 0px;
			border-width: 5px 5px 0px 0px;
		}
		&.lb {
			bottom: 0px;
			left: 0px;
			border-width: 0px 0px 5px 5px;
		}
		&.rb {
			bottom: 0px;
			right: 0px;
			border-width: 0px 5px 5px 0px;
		}
	}
}
</style>
