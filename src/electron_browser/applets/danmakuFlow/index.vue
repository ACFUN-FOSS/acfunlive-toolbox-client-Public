<template>
	<div class="example" v-loading="loading">
		<div class="start center-column" v-if="danmakuStatus=='initial'">
			<el-button size="mini" type="primary" @click="danmakuType='self';startDanmaku()">自己的弹幕</el-button>
			<div class="title">或者</div>
			<el-input size="mini" style="width:200px" v-model="liverUID" placeholder="输入对方UID并按下enter" @keydown.enter="danmakuType='other';startDanmaku()" />
		</div>
		<div class="center-column" v-else-if="danmakuStatus=='error'">
			<div class="title">出错啦</div>
			<div class="title">{{errorText}}</div>
			<el-button size="mini" type="primary" @click="danmakuStatus='initial'">重试</el-button>
		</div>
		<div class="center-column" v-else-if="danmakuStatus=='end'">
			<div class="title">直播已结束</div>
		</div>
		<div v-else-if="danmakuStatus=='danmakuing'" style="width:100%;height:100%">
			<div class="info"><img class="avatar" :src="liverProfile.avatar" />
				<div class="nickname">{{liverProfile.nickname}}</div>
			</div>
			<flow :settings="style" style="width:100%;height:calc(100% - 30px)" :danmakuList="danmakuList" :style="{zoom:`var(--zoom)`}" />
		</div>

		<el-dialog v-model="settingShow">
			<div class="block">
				<div>不透明度</div>
				<el-slider @change="upgradeSettings" v-model="settings.opacity" :min="10" :max="100" />
			</div>
			<div class="block">
				<div>字体大小</div>
				<el-slider @change="upgradeSettings" v-model="settings.zoom" :min="50" :max="150" />
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { registerClient, closeWorker } from "@front/util_function/storeWorker";
import flow from "@front/components/danmakuFlow/index.vue";
import { isNormalDanmaku } from "@front/components/danmakuFlow/utils/tester";
import { danmaku, user, server } from "@front/api";
import { Filter } from "@front/components/danmakuFlow/utils/common";
import { ElMessageBox, ElMessage } from "element-plus";
export default defineComponent({
	name: "danmakuFlow",
	cname: "独立弹幕流",
	icon: "el-icon-chat-line-square",
	description:
		"单独的弹幕流窗口，用于偷窥别的主播的弹幕,不会显示点赞送礼等内容",
	configurations: {
		width: 150,
		height: 600,
		resizable: true,
		multiple: true,
		liveOnly: false
	},
	components: { flow },
	data() {
		return {
			danmakuStatus: "initial",
			danmakuType: "self",
			liverInfo: {
				nickname: "",
				avatar: ""
			},
			liverUID: "",
			errorText: "",
			loading: false,
			filterFlow: [],
			settingShow: false,
			filter: new Filter(),
			style: {
				filter: {
					open: true,
					visitor: true,
					clubOnly: false,
					blackList: true,
					keyword: true,
					combineGift: true,
					combineLike: false,
					combineEnter: true,
					types: [1000]
				},
				maxNum: 100,
				clubLevel: 0,
				speed: "slow",
				hightLight: {
					boss: true,
					manager: false,
					concerned: false
				},
				settingOfType: {},
				animation: true,
				blackList: [],
				keywords: []
			},
			settings: {
				opacity: 50,
				zoom: 100
			}
		};
	},
	mounted() {
		registerClient(
			["danmakuSession", "danmakuProfile", "userProfile"],
			e => {
				Object.assign(this.$store.state, e);
			}
		);
		this.$emit("hasSetting", this.showSetting);
		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
		fetch("/styles/toolBox.json")
			.then(res => res.json())
			.then(json => {
				Object.assign(this.style.settingOfType, json);
			});
	},
	beforeUnmount() {
		closeWorker();
		this.saveSettings();
	},
	computed: {
		...mapState(["danmakuSession", "danmakuProfile", "userProfile"]),
		danmakuList() {
			if (this.danmakuType === "self") {
				return this.danmakuSession.filterFlow;
			}
			return this.filterFlow;
		},
		liverProfile() {
			if (this.danmakuType === "self") {
				return this.userProfile;
			}
			return this.liverInfo;
		}
	},
	methods: {
		reset() {
			this.danmakuStatus = "initial";
			this.danmakuType = "self";
			this.liverUID = "";
			this.errorText = "";
		},
		async startDanmaku() {
			if (this.danmakuType === "self") {
				this.danmakuStatus = "danmakuing";
				return;
			}

			this.loading = true;
			const state = this.$store.state;
			this.filterFlow = [];
			const danmakuCallback = danmaku => {
				if (isNormalDanmaku(danmaku)) {
					const settings = this.style;
					const commonSettings = state.danmakuProfile.common;
					const rank = state.rank;

					// auto click

					const { list } = this.filter.filterUpdate(
						[danmaku],
						this.filterFlow,
						settings,
						commonSettings,
						rank
					);
					this.filterFlow = list;
				}
			};
			const startCallback = res => {
				this.loading = false;
				this.danmakuStatus = "danmakuing";
			};
			const endCallback = () => {
				this.loading = false;
				this.danmakuStatus = "end";
			};
			const errorCallback = e => {
				this.loading = false;
				this.errorText = e;
				this.danmakuStatus = "error";
				if (window.wsl) window.wsl.close();
			};
			if (window.wsl) window.wsl.close();
			server.init({
				onOpen: async () => {
					await user.login({
						account: "",
						password: ""
					});
					let res = {};
					try {
						res = await user.isStreaming({
							userID: parseInt(this.liverUID)
						});
					} catch (error) {
						console.log(error);
						ElMessage({
							message: "该用户不存在！",
							duration: 1500,
							type: "error"
						});
						this.loading = false;
						return;
					}
					const { nickname, avatar, liveID } = res;
					this.liverInfo = {
						nickname,
						avatar
					};
					if (!liveID) {
						ElMessage({
							message: `${nickname} 这位用户不在直播！`,
							duration: 1500,
							type: "error"
						});
						this.loading = false;
						return;
					}
					try {
						await ElMessageBox({
							title: `${nickname} 是这个主播吗？`,
							showCancelButton: true,
							confirmButtonText: "系",
							cancelButtonText: "8是"
						});
					} catch (error) {
						this.loading = false;
						return;
					}
					danmaku
						.startDanmaku(
							{ userID: Number(this.liverUID) },
							{
								startCallback,
								danmakuCallback,
								endCallback,
								errorCallback
							}
						)
						.catch(e => {
							this.errorText = e;
							if (window.wsl) window.wsl.close();
						});
				},
				onClose: () => {
					this.loading = false;
					this.danmakuStatus = "error";
				}
			});
		},
		showSetting() {
			this.settingShow = !this.settingShow;
		},
		loadSettings() {
			let settings = localStorage.getItem(`applet$${this.$options.name}`);
			if (settings) {
				settings = JSON.parse(settings);
				Object.assign(this.settings, settings);
			}

			this.upgradeSettings();
		},
		upgradeSettings() {
			document.body.style.setProperty(
				"--opacity",
				this.settings.opacity / 100
			);
			document.body.style.setProperty("--zoom", `${this.settings.zoom}%`);
		},
		saveSettings() {
			localStorage.setItem(
				`applet$${this.$options.name}`,
				JSON.stringify(this.settings)
			);
		}
	}
});
</script>
<style scoped lang='scss'>
.center-column {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.center-column > * {
	margin-bottom: 8px;
}
.title {
	font-size: 18px;
	color: white;
}
.example {
	position: absolute;
	width: 100%;
	height: 100%;
}
.block {
	padding: 0px 16px;
	width: calc(100% - 32px);
}
.info {
	height: 30px;
	width: 100%;
	display: flex;
	align-items: center;
	padding: 0px 5px;
	border-bottom: 1px rgba(255, 255, 255, 0.5) solid;
}
.avatar {
	height: 20px;
	width: 20px;
	border-radius: 100%;
	border: 2px solid rgba(255, 255, 255, 0.5);
	flex-shrink: 0;
}
.nickname {
	flex-grow: 1;
	padding: 0px 5px;
	overflow: hidden;
	text-overflow: ellipsis;
	color: white;
	user-select: none;
}
</style>
