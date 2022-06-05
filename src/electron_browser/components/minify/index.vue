<template>
	<div class="minify-bar">
		<div class="button el-icon-setting" @click="setting=true" title="设置" />
		<div class="button el-icon-coordinate " :class="{active:isTop}" @click="isTop = !isTop;setTop(isTop)"
			title="置顶" />
		<div class="button el-icon-paperclip " :class="{active:isBlur}" title="背景模式" @click="blurConfirm=true" />
		<div class="button el-icon-minus" @click="minimize()" />
		<div class="button el-icon-full-screen" @click="$store.commit('minify')" title="完整化" />
	</div>
	<el-dialog custom-class="setting" v-model="setting" :close-on-click-modal="false">
		<div class="block">
			<span class="label">背景颜色</span>
			<el-color-picker show-alpha v-model="settings.color" />
		</div>
		<div class="block">
			<span class="label">弹幕大小</span>
			<el-slider :min="10" :max="200" v-model="settings.zoom" />
		</div>
	</el-dialog>
	<el-dialog custom-class="blurConfirm" title="重要提示" v-model="blurConfirm" :show-close="false"
		:close-on-click-modal="false">
		背景模式下窗口将会置顶，并且鼠标操作会穿透，ctrl+F1退出,CTRL+F2回消息。确认进入？
		<template #footer>
			<span class="dialog-footer">
				<el-button size="mini" @click="blurConfirm = false">我不</el-button>
				<el-button size="mini" type="primary" @click="setIgnore();blurConfirm = false">好的</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
	setResizeable,
	win,
	setTop,
	setIgnoreMouseEvent,
	minimize,
	ipcRenderer
} from "@front/util_function/system";
import { ElMessage } from "element-plus";
import throttle from "lodash/throttle";
import { event } from "@front/util_function/eventBus";
export default defineComponent({
	name: "minify",
	data() {
		const opacityTimer: any = null;
		return {
			setting: false,
			blurConfirm: false,
			settings: {
				color: "rgba(0,0,0,0.5)",
				zoom: 100
			},
			isTop: false,
			isBlur: false,
			previousIgnore: false,
			opacityTimer
		};
	},
	mounted() {
		setResizeable(true);
		setTop(false);
		document.body.classList.add("minify");
		this.toPosition("normalPosition", "miniPosition");
		const setting: any = localStorage.getItem("miniSetting");
		if (setting) this.settings = JSON.parse(setting);
		ipcRenderer.on("switch-ignore-mode", this.setIgnore);
		ipcRenderer.on("switch-ignore-mode-temp", this.setIgnoreTemp);
		ipcRenderer.on("hover", this.setHover);
	},
	beforeUnmount() {
		setResizeable(false);
		setTop(false);
		setIgnoreMouseEvent(false);
		document.body.classList.remove("minify");
		document.body.classList.remove("ignore");
		this.toPosition("miniPosition", "normalPosition");
		localStorage.setItem("miniSetting", JSON.stringify(this.settings));
		ipcRenderer.off("switch-ignore-mode", this.setIgnore);
		ipcRenderer.off("switch-ignore-mode-temp", this.setIgnoreTemp);
		ipcRenderer.off("hover", this.setHover);
		event.off("send-message", this.renterIgnore);
	},
	watch: {
		settings: {
			handler(n, o) {
				this.applySetting(n);
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		minimize,
		setTop(isTop: boolean) {
			setTop(isTop);
			if (isTop) {
				ElMessage({
					message:
						"如果要打游戏请将游戏画面调为无边框模式，否则置顶失效",
					type: "success",
					duration: 1500
				});
			}
		},
		setIgnore() {
			setIgnoreMouseEvent((this.isBlur = !this.isBlur));
			if (this.isBlur) {
				setTop((this.isTop = true));
				this.setting = false;
				document.body.classList.add("ignore");
				ElMessage({
					message:
						"切换背景模式成功，如要退出请点击CTRL+F1，回消息请点击CTRL+F2",
					type: "success",
					duration: 1500
				});
			} else {
				document.body.classList.remove("ignore");
				document.getElementById("room-chat")?.classList.remove("hover");
				event.off("send-message", this.renterIgnore);
				ElMessage({
					message: "退出背景模式成功！",
					type: "success",
					duration: 1500
				});
			}
		},
		setIgnoreTemp() {
			this.previousIgnore = this.isBlur;
			setIgnoreMouseEvent((this.isBlur = false));
			document.body.classList.remove("ignore");
			document.getElementById("room-chat")?.classList.add("hover");
			event.emit("message-focus");
			event.on("send-message", this.renterIgnore);
		},
		renterIgnore() {
			if (this.previousIgnore) {
				setIgnoreMouseEvent((this.isBlur = true));
				setTop((this.isTop = true));
				this.setting = false;
				document.body.classList.add("ignore");
			}
			document.getElementById("room-chat")?.classList.remove("hover");
			event.off("send-message", this.renterIgnore);
		},
		setHover(_: any, msg: any) {
			if (msg) {
				document.body.classList.add("hover");
			} else {
				document.body.classList.remove("hover");
			}
		},
		toPosition(save: string, load: string) {
			const winPosition = win.getPosition();
			const saveData = {
				width: parseInt(`${window.innerWidth}`),
				height: parseInt(`${window.innerHeight}`),
				x: winPosition[0],
				y: winPosition[1]
			};
			if (save === "normalPosition") {
				saveData.width = 1048;
				saveData.height = 724;
			}
			localStorage.setItem(save, JSON.stringify(saveData));
			const position: any = localStorage.getItem(load);
			if (position) win.setBounds(JSON.parse(position));
		},
		applySetting: throttle(function(setting: any) {
			document.body.style.setProperty("--bgColor", setting.color);
			document.body.style.setProperty("--zoom", `${setting.zoom}%`);
		}, 100)
	}
});
</script>
<style scoped lang='scss'>
.minify-bar {
	height: 24px;
	display: flex;
	position: fixed;
	transition: background-color 0.25s;
	right: 0px;
	top: -24px !important;
	cursor: move;
	.button {
		display: flex;
		align-items: center;
		cursor: pointer;
		border: none;
		background-color: rgba(0, 0, 0, 0);
		font-size: 14px;
		color: white;
		border-radius: 0px;
		padding: 2px 8px;
		margin: 0px;
		transition: background-color 0.25s;
		&:hover,
		&.active {
			background-color: rgba(255, 255, 255, 0.25);
		}
	}
}
.block {
	padding: 0px 16px;
	width: calc(100% - 32px);
}
</style>
<style lang="scss">
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
body.minify {
	padding: 0px;
	background-color: var(--bgColor) !important;
	border-radius: 4px !important;
	#home {
		width: 100% !important;
		.right {
			width: 100% !important;
		}
	}
	.appletList {
		display: none;
	}
	&.ignore {
		#room-chat,
		.roomList {
			display: none !important;
		}
		.danmakuPanel .danmaku-flow {
			top: 35px !important;
			height: calc(100vh - 49px) !important;
		}
		.super-chat-list {
			top: 0px !important;
		}
	}
	&.hover.ignore {
		filter: opacity(0.1);
		background-color: rgba(0, 0, 0, 0.1) !important;
	}
	.el-message {
		width: 100vw !important;
		min-width: 0px !important;
	}
	.el-overlay {
		margin: 0px !important;
		height: 100vh !important;
		width: 100vw !important;
		position: fixed;
		top: 0px;
		left: 0px;
		background-color: transparent;
		pointer-events: none;
		overflow: hidden;
		z-index: 10000;
		.el-message-box {
			position: absolute;
			left: 0px;
			top: 20%;
			width: 100vw;
			z-index: 10000;
			pointer-events: all;
		}
		.el-dialog.setting {
			pointer-events: all;
			position: fixed;
			margin: 0px;
			bottom: 16px;
			left: 16px;
			width: calc(100vw - 32px) !important;
			height: 150px;
			.el-dialog__header {
				padding: 5px;
			}
			.el-dialog__body {
				box-sizing: border-box;
				padding: 0px;
				width: 100%;
				height: calc(100% - 28px);
				overflow-y: scroll;
				@include scrollbarDark();
			}
		}
		.el-dialog.blurConfirm {
			position: fixed;
			pointer-events: all;
			left: 16px;
			width: calc(100vw - 32px) !important;
			top: 50px;
		}
	}
	@media screen and (max-width: 590px) {
		.roomStatus > .title {
			display: none;
		}
	}
	@media screen and (max-width: 540px) {
		.subtitle:first-child {
			display: none;
		}
	}
	@media screen and (max-width: 440px) {
		.subtitle:last-child {
			display: none;
		}
	}
	.content,
	#home,
	#statusBar,
	.roomList {
		background-color: transparent !important;
		color: white;
	}
	.el-tabs__item {
		color: rgba(255, 255, 255, 0.5) !important;
		&.is-active {
			color: rgba(255, 255, 255, 1) !important;
		}
	}
	.el-tabs__active-bar {
		background-color: transparent !important;
	}
	.el-tabs__nav-wrap::after {
		height: 1px;
	}
	#sidebar {
		display: none;
	}

	#topbar {
		margin: 0px 5px;
		width: calc(100% - 10px);
		height: 25px;
		.avatar,
		.el-dropdown,
		.buttonIcon {
			display: none !important;
		}
	}
	.minify-bar {
		position: fixed;
		top: 0px;
		right: 0px;
	}
	.content {
		& > .view {
			display: none !important;
		}
	}
	.rowFrame > .title {
		display: none;
	}
	#statusBar {
		.switch,
		.contentTitle {
			display: none;
		}
		.contentInner {
			margin: 0px;
			width: 100vw;
		}
		#roomInfo {
			height: 0px;
			width: 0px;
			user-select: none;
			.liveCover {
				display: none;
			}
			.roomStatus {
				width: calc(100vh - 100px);
				min-width: 100px;
				position: fixed;
				top: -25px;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: center;
				height: 25px;
				.title,
				.iconCounter.counter,
				.middle .subtitles .subtitle {
					color: white !important;
				}
				.title {
					font-size: 12px !important;
					max-width: 50px;
					margin-left: 16px;
				}
				pointer-events: none;
				.middle {
					height: 25px;
					flex-grow: unset;
					.subtitles {
						flex-direction: row;
						align-items: center;
						height: 25px;
						.subtitle {
							margin-left: 15px;
						}
					}
				}
				.counters {
					margin-left: 15px;
				}
			}
		}
	}
	.shotcut {
		display: none;
	}
	.superChatEnable {
		.super-chat-list {
			position: fixed;
			right: 0px;
			top: 40px;
			width: 100%;
			z-index: 100;
			border: none;
			.super-chat-list-block .content,
			.super-chat-list-panel-content {
				zoom: var(--zoom);
			}
			&::after {
				color: rgba(255, 255, 255, 0.5);
			}
		}
		.danmaku-flow {
			height: calc(100vh - 100px) !important;
			top: 75px !important;
		}
	}
	.danmakuPanel {
		.slider {
			display: none !important;
		}
		.el-tabs__nav-scroll {
			margin-left: 15px;
		}
		.el-tabs__item.is-top.is-active {
			font-size: 12px !important;
		}
		.roomList {
			position: fixed;
			top: 0px;
			left: 0px;
			width: 100vw;
			background-color: white;
			.el-tabs {
				position: relative;
				top: 0px;
			}
			.user-item {
				margin-top: 5px;
				width: calc(100% - 10px);
			}
			&:hover {
				& > div:last-child {
					display: block;
				}
			}
			& > div:last-child {
				transform: none !important;
				height: unset !important;
				padding: 16px;
				display: none;
				position: relative;
				background-color: white;
				color: black;
			}
			.hidden > div {
				max-height: calc(100vh - 200px) !important;
			}
		}
		.danmaku-flow {
			box-sizing: border-box;
			height: calc(100vh - 65px);
			padding-bottom: 35px !important;
			padding-top: 8px;
			width: 100vw;
			position: fixed;
			left: 0px;
			top: 40px;
			* {
				zoom: var(--zoom);
			}
		}

		.danmaku-list-bg::before {
			background-color: transparent !important;
		}
		#room-chat {
			position: fixed;
			width: 100%;
			left: 0px;
			bottom: 0px;
			font-size: 12px;
			transform: translateY(100%);

			transition: transform 0.25s;
			transition-delay: 0.5s;
			&.hover {
				transition-delay: 0s !important;
				transform: translateY(0px) !important;
			}
		}
	}
	&.hover {
		#room-chat {
			transition-delay: 0s !important;
			transform: translateY(0px) !important;
		}
	}
}
</style>
