<template>
	<div class="outer" v-loading="loading" :style="{backgroundImage:`url(${settings.backgroundImage})`}">
		<div class="title shadow">{{status==='setting'?"设置抽奖参数":`弹幕抽奖：${title}`}}</div>
		<div class="votePanel" v-show="status=='setting'">
			<div class="row">
				<span class="shadow">奖品</span>
				<el-input size="mini" v-model="title" />
			</div>
			<div class="row">
				<span class="shadow">选择抽奖类型</span>
				<el-select size="mini" v-model="lotteryType" max-height="100px">
					<el-option value="keyword" label="关键词抽奖" />
					<el-option value="gift" label="送出指定礼物抽奖" />
				</el-select>
			</div>
			<div class="row">
				<span class="shadow">显示中奖概率</span>
				<el-switch v-model="showChance" />
			</div>
			<div class="row" v-if="lotteryType=='gift'">
				<span class="shadow">选择礼物</span>
				<el-select size="mini" v-model="giftName" class="drop-down-maxHeight">
					<el-option v-for="gift in gifts" :key="gift.giftID" :value="gift.giftName" :label="gift.giftName" />
				</el-select>
			</div>
			<div class="row" v-if="lotteryType=='keyword'">
				<span class="shadow">输入关键词</span>
				<el-input size="mini" v-model="keyword" :maxlength="10" placeholder="不要输入标点符号,最多10字" />
			</div>
			<div class="row">
				<span class="shadow">输入奖品数量</span>
				<el-input-number size="mini" v-model="lotteryNum" :min="1" />
			</div>
			<div class="row">
				<el-button size="mini" type="primary" @click="status='InProgress'">开始抽奖</el-button>

			</div>
		</div>
		<div class="votePanel" v-show="status=='InProgress'">
			<div class="row">
				<span class="shadow" v-if="lotteryType=='keyword'">输入关键词“{{keyword}}”参与抽奖</span>
				<span class="shadow" v-else>送出一个 “{{giftName}}”参与抽奖</span>
			</div>
			<div class="row">
				<span class="shadow">已有{{lotteryPool.length}}人加入奖池</span>
			</div>
			<div class="row">
				<span class="shadow" v-show="showChance">抽取{{lotteryNum}}人，当前中奖率{{rate}}</span>
			</div>
			<div style="height:calc(100% - 147px)"></div>
			<div class="row">
				<el-button size="mini" type="primary" @click="getLucky()" style="width:100%">开奖</el-button>

			</div>
		</div>
		<div class="votePanel" v-show="['Resulting','Resulted'].indexOf(status)>-1">
			<div class="row" style="height:calc(100% - 54px);position:relative">
				<div style="height:100%;width:100%;overflow-y:auto;">
					<div style="display:flex;justify-content:space-between;width:100%;margin-bottom:8px" v-for="user in luckyPool" :key="user.userID">
						<span class="shadow">{{user.nickName}}</span>
						<el-button size="mini" type="primary" v-show="!user.pending" @click="open(user.userID)">个人主页</el-button>
					</div>
				</div>
			</div>
			<div class="row">
				<el-button size="mini" type="primary" @click="reset" :disabled="status=='Resulting'" style="width:100%">{{status=="Resulting"?"开奖中":"重新抽"}}</el-button>
				<el-button size="mini" type="primary" @click="save" :disabled="status=='Resulting'" style="width:100%">保存结果</el-button>
			</div>
		</div>
		<el-dialog v-model="settingShow">
			<div class="block">
				<div>背景图片</div>
				<img-input-static v-model="settings.backgroundImage" />
			</div>
			<div class="block">
				<div>不透明度</div>
				<el-slider @change="upgradeSettings" v-model="settings.opacity" :min="10" :max="100" />
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
import { init } from "@front/api/server";
import random from "lodash/random";
import { toTXT } from "@front/util_function/exportTo";
export default defineComponent({
	name: "lottery",
	cname: "限时抽奖",
	icon: "el-icon-s-ticket",
	description:
		"指定入奖票规则（关键词/礼物），在一定时间内收集奖池人数（去重），手动开奖",
	configurations: {
		width: 400,
		height: 600,
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
			giftName: "",
			keyword: "",
			lotteryType: "keyword",
			lotteryNum: 5,
			showChance: true,
			lotteryPool: [],
			luckyPool: [],
			regexp: "",
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
			["changedDanmaku", "userProfile", "roomProfile"],
			({ changedDanmaku, userProfile, roomProfile }) => {
				Object.assign(this.$store.state, { userProfile, roomProfile });
				const tester =
					this.lotteryType === "gift" ? hasGift : hasContent;
				this.addPool(changedDanmaku.filter(danmaku => tester(danmaku)));
			}
		);
		this.$emit("hasSetting", this.showSetting);
		init({
			onOpen: () => {
				this.getGift();
			}
		});

		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		closeWorker();
		clearTimeout(this.timer);
		this.saveSettings();
	},
	computed: {
		...mapState(["userProfile", "roomProfile"]),
		rate() {
			if (this.lotteryPool.length <= this.lotteryNum) {
				return "100%";
			}
			return (
				((this.lotteryNum * 100) / this.lotteryPool.length).toFixed(2) +
				"%"
			);
		}
	},
	methods: {
		save() {
			let str = "";
			this.luckyPool.forEach(lucker => {
				str += `${
					lucker.nickName
				}, ${`https://www.acfun.cn/u/${lucker.userID}`} \n`;
			});
			toTXT(`${new Date().toTimeString()} 抽奖结果`, str);
		},
		open(uid) {
			window.open(`https://www.acfun.cn/u/${uid}`);
		},
		reset() {
			this.lotteryPool = [];
			this.luckyPool = [];
			this.status = "setting";
		},
		getLucky(currentSelected = null, firstTime = 0, pool = null) {
			this.status = "Resulting";
			if (!pool) pool = [...this.lotteryPool];
			if (firstTime === 0) firstTime = Date.now();
			if (
				this.luckyPool.length >
				Math.min(this.lotteryNum, this.lotteryPool.length)
			) {
				this.status = "Resulted";
				this.luckyPool.shift();
				return;
			}
			if (Date.now() - firstTime > 500 && currentSelected) {
				if (this.luckyPool[0].pending) {
					this.luckyPool[0] = currentSelected;
				} else {
					this.luckyPool.shift(currentSelected);
				}
				this.luckyPool = [...this.luckyPool];
				currentSelected = null;
				firstTime = Date.now();
			}
			if (!currentSelected) {
				const select = random(0, pool.length - 1);
				if (select < 0) {
					this.status = "Resulted";
					return;
				}
				currentSelected = pool.splice(select, 1)[0];
				this.luckyPool.unshift({
					userID: 0,
					nickName: "",
					pending: true
				});
			}
			if (this.luckyPool[0]?.pending) {
				this.luckyPool[0] = {
					...pool[random(0, pool.length - 1)],
					pending: true
				};
				this.luckyPool = [...this.luckyPool];
			}
			requestAnimationFrame(() => {
				this.getLucky(currentSelected, firstTime, pool);
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
				}
			}
			if (!retry) {
				setTimeout(() => {
					this.getGift();
				}, 1000);
			}
		},
		generateTester() {
			const testerArr = this.voteItem.map(item => {
				return item.keyword;
			});
			this.regexp = new RegExp(testerArr.join("|"), "g");
		},
		addPool(danmakus) {
			danmakus.forEach(danmaku => {
				const uid = getUID(danmaku);
				if (this.lotteryPool.find(user => user.userID === uid)) {
					return;
				}
				let shouldadd = false;
				switch (this.lotteryType) {
					case "gift":
						shouldadd = getGiftName(danmaku) === this.giftName;
						break;
					case "keyword":
						shouldadd = Boolean(
							getContent(danmaku)?.match(this.keyword.trim())
						);
				}
				if (shouldadd) {
					this.lotteryPool = [
						...this.lotteryPool,
						{
							userID: uid,
							nickName: getNickName(danmaku)
						}
					];
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
	margin-bottom: 8px;
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
	align-items: center;
	justify-content: space-between;
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
