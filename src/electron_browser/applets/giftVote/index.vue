<template>
	<div class="outer" v-loading="loading" :style="{backgroundImage:`url(${settings.backgroundImage})`}">
		<div class="title shadow">{{status==='setting'?"设置投票参数":`礼物投票：${title}`}}</div>
		<div class="votePanel" v-show="status=='setting'">
			<div class="row">
				<span class="shadow">标题</span>
				<el-input size="mini" v-model="title" />
			</div>
			<div class="row" v-for="(item,index) in voteItem" :key="index">
				<span class="shadow">选项{{index+1}}</span>
				<el-input size="mini" v-model="item.keyword" :maxlength="6" placeholder="不要输入标点符号,最多6字" />
				<el-button size="mini" @click="voteItem = voteItem.filter(i=>i!==item)">删除</el-button>
			</div>
			<div class="row">
				<span class="shadow">选择礼物</span>
				<el-select size="mini" v-model="giftName">
					<el-option v-for="gift in gifts" :key="gift.giftID" :value="gift.giftName" :label="gift.giftName" />
				</el-select>
			</div>
			<div class="row">
				<span class="shadow">去重默认开启,多次送礼不会重复获得投票机会</span>
			</div>
			<div class="row">
				<el-input size="mini" :model-value="url">
					<template #append>
						<el-button type="primary" size="mini" class="btnBase attach" @click="copy(url)">复制</el-button>
					</template>
				</el-input>
			</div>
			<div class="row">
				<el-button size="mini" v-if="voteItem.length<6" type="primary" @click="addItem">点击添加（剩余可添加{{5-voteItem.length}}）</el-button>

				<el-button size="mini" type="primary" @click="status='voting'" :disabled="voteItem.length<2||!giftName">开始投票</el-button>

			</div>
		</div>
		<div class="votePanel" v-if="['voting','voted'].includes(status)">
			<div class="graph">
				<div class="set" v-for="(item,index) in voteItem" :key="index" :style="{'width':`${100/voteItem.length}%`}">
					<span class="shadow">{{item.count}}</span>
					<div class="column" :style="{'height':`${item.count?item.count*100/max:0}%`}" @click="showIndex=index;voterShow=true" />
					<span class="shadow">{{item.keyword}}</span>
				</div>
			</div>
			<div class="row">
				<el-button size="mini" type="primary" @click="status='voted'" v-show="status==='voting'">停止计票</el-button>
				<el-button size="mini" type="primary" v-show="status=='voted'" disabled>点击柱形图查看投票人</el-button>
				<el-button size="mini" type="primary" v-show="status=='voted'" @click="reset">重新投票</el-button>
			</div>
		</div>
		<el-dialog :title="`投${voteItem[showIndex]?voteItem[showIndex].keyword:''}的观众列表`" v-model="voterShow">
			<div class="block" v-for="(person,index) in voteItem[showIndex].person" :key="index">
				{{person}}
			</div>
		</el-dialog>
		<el-dialog v-model="settingShow">
			<div class="block">
				<div>背景图片</div>
				<img-input-static v-model="settings.backgroundImage" />
			</div>
			<div class="block">
				<div>不透明度</div>
				<el-slider @change="upgradeSettings" v-model="settings.opacity" :min="10" :max="100" />
			</div>
			<div class="block">
				<div>OBS文字缩放</div>
				<el-slider @change="upgradeSettings" v-model="settings.zoom" :min="50" :max="300" />
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { registerClient, closeWorker } from "@front/util_function/storeWorker";
import {
	hasContent,
	hasGift
} from "@front/components/danmakuFlow/utils/tester";
import {
	getTime,
	getGiftName,
	getContent,
	getNickName,
	getUID
} from "@front/components/danmakuFlow/utils/getter";
import { user, room } from "@front/api";
import { wsevent } from "@front/api/wsbus";
import { isOnline, isConnecting, init } from "@front/api/server";

import { copy } from "@front/util_function/clipboard";
export default defineComponent({
	name: "danmakuGiftVote",
	cname: "弹幕礼物投票",
	icon: "el-icon-price-tag",
	description:
		"输入关键词后，根据弹幕关键词进行投票，只有送出指定礼物的观众才能投票",
	configurations: {
		width: 400,
		height: 300,
		resizable: true,
		multiple: false,
		liveOnly: false
	},
	data() {
		return {
			loading: false,
			settingShow: false,
			voterShow: false,
			status: "setting",
			title: "",
			norepeat: false,
			voteItem: [],
			voteUserID: new Set(),
			url: `http://${window.location.host}/obs/${this.$options.name}`,
			giftName: "",
			giftSended: new Set(),
			gifts: [],
			regexp: "",
			showIndex: 0,
			settings: {
				opacity: 50,
				zoom: 100,
				backgroundImage: ""
			},
			timer: null
		};
	},
	mounted() {
		registerClient(
			["changedDanmaku", "roomProfile"],
			({ changedDanmaku, roomProfile }) => {
				Object.assign(this.$store.state, { roomProfile });
				if (this.status === "voting") {
					this.addVote(
						changedDanmaku.filter(
							danmaku => hasContent(danmaku) || hasGift(danmaku)
						)
					);
				}
			}
		);
		this.$emit("hasSetting", this.showSetting);
		this.registerOBS();
		this.getGift();
		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		closeWorker();
		clearTimeout(this.timer);
		this.saveSettings();
	},
	computed: {
		...mapState(["roomProfile"]),
		max() {
			return Math.max(
				...this.voteItem.map(item => {
					return item.count;
				})
			);
		}
	},
	methods: {
		copy,
		reset() {
			this.status = "setting";
			this.regexp = "";
			this.giftSended = new Set();
			this.voteUserID = new Set();
			this.voteItem.forEach(item => {
				item.person = [];
				item.count = 0;
			});
		},
		async getGift() {
			let retry = Boolean(this.roomProfile.liveID);
			if (retry) {
				try {
					await user.login({
						account: "",
						password: ""
					});
					const res = await room.getGiftList({
						liveID: this.roomProfile.liveID
					});
					this.gifts = res;
				} catch (error) {
					retry = false;
					console.log(error);
				}
			}
			if (!retry) {
				setTimeout(() => {
					this.getGift();
				}, 1000);
			}
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
						status: this.status,
						title: this.title,
						voteItem: this.voteItem,
						backgroundImage: this.settings.backgroundImage,
						giftName: this.giftName,
						max: this.max,

						zoom: this.settings.zoom
					},
					`obs-${this.$options.name}`
				);
			}

			this.timer = setTimeout(() => {
				this.registerOBS();
			}, 3000);
		},
		generateTester() {
			const testerArr = this.voteItem.map(item => {
				return "投票@" + item.keyword;
			});
			testerArr.sort((a, b) => b.length - a.length);
			this.regexp = new RegExp(testerArr.join("|"), "g");
		},
		addVote(danmakus) {
			if (!this.regexp) this.generateTester();
			danmakus.forEach(danmaku => {
				const uid = getUID(danmaku);
				if (hasGift(danmaku)) {
					if (
						getGiftName(danmaku) !== this.giftName ||
						this.voteUserID.has(uid)
					) {
						return;
					}
					this.giftSended.add(uid);
					return;
				}
				if (!this.giftSended.has(uid)) return;
				const content = getContent(danmaku).match(this.regexp);
				if (!content) return;
				content.sort((a, b) => b.length - a.length);

				const found = this.voteItem.find(
					item => item.keyword === content[0].replace("投票@", "")
				);
				if (found) {
					found.count++;
					found.person.push(getNickName(danmaku));
					this.voteUserID.add(uid);
					this.giftSended.delete(uid);
				}
			});
		},
		addItem() {
			this.voteItem = [
				...this.voteItem,
				{
					keyword: "",
					count: 0,
					person: []
				}
			];
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
}
.block {
	padding: 0px 16px;
	width: calc(100% - 32px);
}

.row {
	display: flex;
	justify-content: space-between;
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
	height: calc(100% - 53px);
	overflow-y: auto;
}
</style>
