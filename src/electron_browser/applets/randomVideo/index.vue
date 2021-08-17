<template>
	<div class="outer" v-loading="loading">
		<div class="votePanel">
			<div class="row">
				<span class="shadow">需要礼物</span>
				<el-switch @change="saveSettings" v-model="settings.needGift" />
			</div>
			<div class="row" v-if="settings.needGift">
				<span class="shadow">礼物最小值</span>
				<el-input-number @change="saveSettings" size="mini" v-model="settings.triggerValue" :min="0" />
			</div>
			<div class="row">
				<el-input size="mini" :model-value="url">
					<template #append>
						<el-button type="primary" size="mini" class="btnBase attach" @click="copy(url)">复制</el-button>
					</template>
				</el-input>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { registerClient, closeWorker } from "@front/util_function/storeWorker";
import {
	hasContent,
	hasGift,
	isOwner
} from "@front/components/danmakuFlow/utils/tester";
import {
	getTime,
	getContent,
	getGiftValue,
	getUID
} from "@front/components/danmakuFlow/utils/getter";
import { wsevent } from "@front/api/wsbus";
import { isOnline, isConnecting, init } from "@front/api/server";

import { copy } from "@front/util_function/clipboard";
export default defineComponent({
	name: "randomVideo",
	cname: "随机动态壁纸",
	icon: "el-icon-picture-outline",
	description: "投蕉/投礼物并弹幕发送“@换壁纸@”更换图片,",
	configurations: {
		width: 400,
		height: 150,
		resizable: true,
		multiple: false,
		liveOnly: false
	},
	data() {
		return {
			loading: false,
			url: `http://${window.location.host}/obs/${this.$options.name}`,
			settings: {
				opacity: 50,
				triggerValue: 0,
				needGift: false,
				videoId: 1,
				videoNum: 33
			},
			giftSended: new Set(),
			timer: null
		};
	},
	mounted() {
		registerClient(["changedDanmaku"], ({ changedDanmaku }) => {
			for (const danmaku of changedDanmaku) {
				const uid = getUID(danmaku);
				if (
					this.settings.needGift &&
					hasGift(danmaku) &&
					getGiftValue(danmaku) >= this.settings.triggerValue
				) {
					this.giftSended.add(uid);
				}
				if (hasContent(danmaku)) {
					if (
						!isOwner(danmaku, this.$store.state) &&
						this.settings.needGift &&
						!this.giftSended.has(uid)
					) {
						continue;
					}
					const content = getContent(danmaku);
					if (!content || !content.includes("@换壁纸@")) {
						continue;
					}
					this.giftSended.delete(uid);
					this.getImage();
					return;
				}
			}
		});
		this.registerOBS();
		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		closeWorker();
		clearTimeout(this.timer);
		this.saveSettings();
	},
	methods: {
		copy,
		getImage() {
			let result = 1;
			do {
				result = parseInt(Math.random() * this.settings.videoNum) + 1;
			} while (result === this.settings.videoId);
			this.settings.videoId = result;
		},
		registerOBS() {
			clearTimeout(this.timer);
			if (!isOnline() && !isConnecting()) {
				init({
					onOpen: () => {
						wsevent.register(`client-${this.$options.name}`);
					}
				});
			} else {
				wsevent.wsEmit(
					"voteUpdate",
					{
						videoId: this.settings.videoId
					},
					`obs-${this.$options.name}`
				);
			}

			this.timer = setTimeout(() => {
				this.registerOBS();
			}, 3000);
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
			this.saveSettings();
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
@font-face {
	font-family: "站酷快乐体";
	src: url("/fonts/站酷快乐体.ttf") format("truetype");
}
.shadow {
	text-shadow: rgb(0, 0, 0) -0.8px -0.8px 0px, rgb(0, 0, 0) 0px -0.8px 0px,
		rgb(0, 0, 0) 0.8px -0.8px 0px, rgb(0, 0, 0) 0.8px 0px 0px,
		rgb(0, 0, 0) 0.8px 0.8px 0px, rgb(0, 0, 0) 0px 0.8px 0px,
		rgb(0, 0, 0) -0.8px 0.8px 0px, rgb(0, 0, 0) -0.8px 0px 0px;
	color: white;
	font-family: 站酷快乐体;
}
.title {
	font-size: 18px;

	box-sizing: border-box;
	width: 100%;
	padding: 16px;
	text-align: center;
}
.outer {
	position: absolute;
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
	background-color: rgba(0, 0, 0, 0.5);
}
.block {
	padding: 0px 16px;
	width: calc(100% - 32px);
}

.row {
	justify-content: space-between;
	display: flex;
	align-items: center;
	padding: 0px 16px 8px 16px;
}
.row span {
	white-space: nowrap;
	flex-shrink: 0;
	font-size: 16px;
}
.graph {
	width: 100%;
	height: calc(100% - 40px);
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
}
.set {
	height: 100%;
	position: relative;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
}
.set span {
	font-size: 18px;
}
.column {
	width: 90%;
	max-width: 50px;
	background-color: rgb(64, 158, 255);
	border-radius: 8px 8px 0px 0px;
	cursor: pointer;
	transition: height 0.3s ease;
}
.column:hover {
	background-color: rgb(138, 196, 255);
}
.votePanel {
	width: 100%;
	margin-top: 16px;
}
</style>
