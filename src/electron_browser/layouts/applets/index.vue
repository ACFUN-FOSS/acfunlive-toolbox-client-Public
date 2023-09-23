<template>
	<div id="home">
		<div class="minify-bar">
			<handler-moving class="handler">{{
				$route.query.name
			}}</handler-moving>
			<div
				class="button el-icon-refresh-right"
				@click="reset()"
				title="刷新"
			/>
			<div
				class="button el-icon-setting"
				@click="openSetting"
				title="设置"
			/>
			<div
				class="button el-icon-monitor"
				@click="openConsole"
				title="控制台"
			/>
			<div
				class="button el-icon-coordinate "
				:class="{ active: isTop }"
				@click="
					isTop = !isTop;
					setTop(isTop);
				"
				title="置顶"
			/>
			<div
				class="button el-icon-minus"
				@click="minimize()"
				title="最小化"
			/>
			<div class="button el-icon-close" @click="close()" title="退出" />
		</div>
		<div class="content">
			<component ref="comp" :is="component" v-bind="utils" />
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import {
	setTop,
	minimize,
	close,
	openConsole,
	loadApplet,
	saveApplet,
	loadConfig
} from "@front/util_function/system";
import { allApi as apis } from "@front/api";
import * as system from "@front/util_function/system";
import HandlerMoving from "@front/components/system/HandlerMoving.vue";
import { loadComponent } from "./httpVue";
import * as lodash from "lodash";
import {
	danmakuTesters,
	danmakuGetters
} from "@front/components/danmakuFlow/danmakuRow/advanceFunctions";
import { wsevent } from "@front/api/wsbus";
import { registerRole } from "@front/util_function/base";
import { registerClient, closeWorker } from "@front/util_function/storeWorker";

export default defineComponent({
	name: "home",
	components: { HandlerMoving },
	methods: {
		openConsole,
		setTop,
		minimize,
		close,
		reset() {
			window.location.reload();
		},
		openSetting() {
			this.$refs.comp.setting = true;
		}
	},
	data() {
		return {
			isTop: false,
			component: null
		};
	},
	mounted() {
		loadConfig().then(res => {
			if (res) {
				Object.assign(this.$store.state.danmakuProfile, res);
			}
		});
		document.body.classList.add("applet");
		let { path, name, configurations } = this.$route.query;
		registerRole(name);
		wsevent.register(
			this.appID,
			this.$store.state.danmakuProfile?.general?.socket || 4396
		);
		path = decodeURIComponent(path);
		loadComponent(path).then(res => {
			const config = JSON.parse(configurations);
			let obsLink = "";
			if (config.obsPath) {
				obsLink = `${
					window.location.origin
				}/obs/applets/?name=${name}&path=${encodeURIComponent(
					config.obsPath
				)}`;
			}
			const { dirname } = require("path");
			const data = {
				configurations: JSON.parse(configurations),
				obsLink,
				dirPath: dirname(path)
			};

			const methods = {
				apis,
				lodash,
				danmakuTesters,
				danmakuGetters,
				registerClient,
				wsevent,
				system,
				loadSettings: () => {
					return loadApplet(name);
				},
				saveSettings: data => {
					return saveApplet(name, data);
				}
			};
			for (const key in methods) {
				data[`s_${key}`] = methods[key];
			}
			this.$nextTick(() => {
				this.component = defineComponent({
					mixins: [res],
					data() {
						return data;
					}
				});
			});
		});
	},
	beforeUnmount() {
		closeWorker();
	}
});
</script>

<style scoped lang="scss">
@import "@front/styles/variables.scss";

#home {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	height: 100%;
	font-size: $--font-size-base;
	box-shadow: $--box-shadow-dark;
	position: absolute;
	background-color: rgba(0, 0, 0, var(--opacity));
	transition: all 0.5s;
	left: 0px;
	top: 0px;
	border-radius: $--border-radius-small;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: row;
}
.content {
	position: absolute;
	top: 24px;
	width: 100%;
	height: calc(100% - 24px);
}
.handler {
	flex-grow: 1;
	color: white;
	padding: 0px 8px;
	justify-content: flex-start;
}
.minify-bar {
	height: 24px;
	width: 100%;
	display: flex;
	position: absolute;
	transition: background-color 0.25s;
	right: 0px;
	top: 0px !important;
	cursor: move;
	user-select: none;
	background-color: rgba(0, 0, 0, 0.5);
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
</style>

<style lang="scss">
@import "@front/styles/scrollbar.scss";
body.applet {
	padding: 0px !important;
	.el-scrollbar {
		max-height: 100px;
		& > div {
			max-height: 100px;
		}
	}
}
.applet {
	.el-dialog {
		width: 100% !important;
		bottom: 0px !important;
		position: absolute;
	}
	.el-overlay {
		margin: 0px !important;
		height: 100% !important;
		width: 100% !important;
		pointer-events: none;
		& > div {
			pointer-events: all;
			margin: 0px !important;
			max-height: calc(100vh - 25px);
			@include scrollbarDark();
		}
	}
	.el-message-box {
		position: absolute;
		left: 0px;
		top: 20%;
		width: 100vw;
		z-index: 10000;
		pointer-events: all;
	}
}
</style>
