<template>
	<div style="width:100%;height:100%;position:relative">
		<super-chat-list class="super-chat" v-if="enable&&superChatEnable" />
		<flow v-if="enable" :class="{superChatEnable}" :settings="danmakuProfile.web" :danmakuList="danmakuSession.filterFlow" />
		<transition name="fade" mode="out-in">
			<div class="tips" v-if="!enable">
				<div class="positioner" :class="pos" v-for="pos in ['lt','rt','lb','rb']" :key="pos" />
				<div class="title">弹幕准备中。<span v-for="dot in dotsCount" :key="dot">。</span></div>
				<div v-for="checker of checkers" :key="checker.label" class="checkers">
					<div class="label">{{checker.label}}</div>
					<div class="status" :class="checker.value?'el-icon-circle-check success':'el-icon-circle-close failed'" />
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { wsevent, user, server } from "@front/api";
import { event } from "@front/util_function/eventBus";
import { commonSettings } from "@front/datas/danmaku";
import { tempInfo } from "@front/datas/temp";
import flow from "@front/components/danmakuFlow/index.vue";
import { mapState, mapGetters } from "vuex";
import superChatList from "@front/components/superChat/index.vue";
import { registerRole } from "@front/util_function/base";
import { actions } from "@front/store/actions";
export default defineComponent({
	name: "webDanmaku",
	components: {
		flow,
		superChatList
	},
	data() {
		const danmakuList: any = [];
		const statusTimer: any = null;
		// @ts-ignore
		const that: any = this;
		return {
			danmakuList,
			statusTimer,
			settingTimer: false,
			dotsCount: 0,
			reconnect: false,
			status: {
				isOnline: {
					label: "连接在线",
					method: that.refresh,
					value: false,
					wait: 2000
				},
				registered: {
					label: "通信注册",
					method: that.registerWS,
					value: false,
					wait: 500
				},
				logined: {
					label: "登陆",
					method: that.login,
					value: false,
					wait: 1500
				},
				hasSession: {
					label: "主播信息",
					method: that.requestSession,
					value: false,
					wait: 500
				},
				hasSetting: {
					label: "弹幕设置",
					method: that.updateSettings,
					value: false,
					wait: 1500
				},
				hasRank: {
					label: "牌子信息",
					value: false,
					wait: 500
				},
				isStreaming: {
					label: "直播启动",
					method: that.requestStreaming,
					value: false,
					wait: 500
				}
			}
		};
	},
	created() {
		this.$store.state.isLogined = true;
		this.registerEvents();
	},
	mounted() {
		this.$store.dispatch("startServe").then(() => {
			this.registerWS();
		});
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
			"rank",
			"streamStatus",
			"danmakuSession"
		]),
		checkers(): Array<any> {
			return Object.values(this.status);
		},
		enable(): boolean {
			for (const item of Object.values(this.status)) {
				if (!item.value) return false;
			}
			return true;
		}
	},
	methods: {
		refresh() {
			clearTimeout(this.statusTimer);
			this.checkers.forEach((checker: any) => {
				checker.value = false;
			});
			if (server.isOnline()) {
				// @ts-ignore
				window.wsl.close();
			}
		},
		registerEvents() {
			wsevent.on("update-style", this.updateSettings);
			wsevent.on("update-settings", this.updateSettings);
			wsevent.on("update-session", this.updateSession); // rank 由服务器定期发送
			wsevent.on("update-rank", this.updateRank);
			wsevent.on("update-manager", this.updateManager);
			wsevent.on("registered", () => {
				this.status.registered.value = true;
			});
			event.on("streamStatusChanged", this.checkServerState);
		},
		unRegisterEvents() {
			wsevent.off("update-style", this.updateSettings);
			wsevent.off("update-settings", this.updateSettings);
			wsevent.off("update-session", this.updateSession); // rank 由服务器定期发送
			wsevent.off("update-rank", this.updateRank);
			wsevent.off("update-manager", this.updateManager);
			event.off("streamStatusChanged", this.checkServerState);
		},
		login() {
			return new Promise(resolve => {
				user.login({
					account: "",
					password: ""
				}).then(() => {
					this.status.logined.value = true;
					this.registerWS();
					resolve(true);
				});
			});
		},
		checkServerState() {
			switch (this.streamStatus.step) {
				case "online":
					this.status.isOnline.value = true;
					this.registerWS();
					this.statusLooper();
					break;
				case "danmakuing":
					this.startDanmaku();
					break;
				case "streamEnded":
					window.location.reload();
					break;
			}
		},
		statusLooper() {
			clearTimeout(this.statusTimer);
			this.dotsCount = (this.dotsCount + 1) % 4;
			const next = (time = 500) => {
				this.statusTimer = setTimeout(() => {
					this.statusLooper();
				}, time);
			};
			for (const checker of this.checkers) {
				if (!checker.value) {
					// @ts-ignore
					if (checker.method) {
						const res = checker.method();
						if (res instanceof Promise) {
							res.finally(() => {
								next();
							});
						} else {
							next(checker.wait);
						}
					} else {
						next();
					}
					return;
				}
			}
		},
		registerWS() {
			wsevent.register("client");
		},
		requestSession() {
			if (!this.userSession.userID) {
				wsevent.wsEmit("get-session", {}, "server");
			} else {
				this.status.hasSetting.value = true;
			}
		},
		requestSettings() {
			wsevent.wsEmit("get-settings", {}, "server");
		},
		requestStreaming() {
			return this.$store.dispatch("streamable").then((res: any) => {
				this.status.isStreaming.value = Boolean(res.liveID);
			});
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
					this.status.hasSetting.value = true;
					this.$store.state.danmakuProfile.web = json.web;
					this.$store.state.danmakuProfile.common =
						json.common || commonSettings();
					this.$store.state.temp = tempInfo();
				})
				.finally(() => {
					this.settingTimer = false;
				});
		},
		updateSession(session: any) {
			if (
				this.status.hasSession.value &&
				this.userSession.userID !== session.userID
			) {
				this.refresh();
			}
			if ((this.status.hasSession.value = Boolean(session))) {
				this.$store.state.userSession = session;
			}
		},
		updateRank(rank: any) {
			if ((this.status.hasRank.value = Boolean(rank))) {
				this.$store.state.rank = rank;
			}
		},
		updateManager(res: any) {
			this.$store.state.managerList = res.list;
		},
		startDanmaku() {
			if (!this.danmakuSession.filterFlow.length) {
				this.danmakuSession.filterFlow.push({
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
						content: "弹幕流启动成功！直播开始啦开始啦！"
					}
				});
			}
		},
		reWait() {
			["hasSession", "isStreaming", "hasRank", "danmakuing"].forEach(
				(i: any) => {
					// @ts-ignore
					this.status[i].value = false;
				}
			);
		}
	}
});
</script>
<style lang='scss'>
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
