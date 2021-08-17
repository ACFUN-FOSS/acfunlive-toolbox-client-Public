<template>
	<div class="outer" v-loading="loading" :style="{backgroundImage:`url(${settings.backgroundImage})`}">
		<div class="title shadow">留言列表({{settings.mode?'手动模式':'先到先得模式'}})</div>
		<div class="question-list">
			<div class="question-row" :class="{active:isActive(question)}" v-for="question in questionList" :key="question.id">
				<div class="question-group">
					<title-scrolling :label="question.title" />
					<title-scrolling :label="question.nickname" />
				</div>
				<el-button-group>
					<el-button class="btn" size="mini" type="primary" @click="toTop(question,true)">切换</el-button>
					<el-button class="btn" size="mini" @click="detailText = question;detail = true">详情</el-button>
					<el-button class="btn" size="mini" type="danger" @click="remove(question)">移除</el-button>
				</el-button-group>
			</div>
		</div>
		<el-input size="mini" v-model="owner" @keydown.enter="ownerAddQuestion()" placeholder="主播留言，会强行顶掉现在的留言" />
		<el-dialog v-model="detail">
			{{detailText.nickname}}的留言:&nbsp;{{detailText.title}}
		</el-dialog>
		<el-dialog v-model="settingShow">
			<div class="row">
				<div>留言模式</div>
				<el-select @change="upgradeSettings" size="mini" v-model="settings.mode">
					<el-option label="先到先得" :value="0" />
					<el-option label="手动" :value="1" />
				</el-select>
			</div>
			<div class="row">
				<div class="hint">先到先得：自动展示第一个留言的观众；手动：系统收集观众留言，主播手动切换</div>
			</div>
			<div class="row" v-show="settings.mode===0">
				<div>冷却时间</div>
				<el-input-number @change="upgradeSettings" size="mini" v-model="settings.cooldown" :min="1" />
			</div>
			<div class="row" v-show="settings.mode===0">
				<div class="hint">留言持续时间，单位为分钟，时间结束以后观众才可以发出新留言</div>
			</div>
			<div class="row" v-show="settings.mode===0">
				<div>冷却结束即消失</div>
				<el-switch @change="upgradeSettings" v-model="settings.disappearWhenCool" />
			</div>
			<div class="row" v-show="settings.mode===0">
				<div class="hint">如果开启，则冷却时间结束后obs处留言会立即消失，但是列表中该留言仍需手动移除，否则将会维持到下一个留言</div>
			</div>
			<div class="row">
				<div>留言门槛</div>
				<el-input-number size="mini" v-model="settings.ticket" :min="0" />
			</div>
			<div class="row">
				<div class="hint">单位为ac币，即一次性送出大于等于该ac币数量礼物才能留言，为0时是香蕉</div>
			</div>
			<div class="row">
				<div>屏蔽关键词</div>
				<el-select style="width:50%" size="mini" v-model="settings.blackList" multiple filterable allow-create>
					<el-option v-for="(item,index) in settings.blackList" :key="index" :label="item" :value="item">
					</el-option>
				</el-select>
			</div>
			<div class="block">
				<div>OBS文字缩放</div>
				<el-slider @change="upgradeSettings" v-model="settings.zoom" :min="50" :max="300" />
			</div>
			<div class="row">
				<span class="shadow">obs文字轮廓大小</span>
				<el-input-number @change="upgradeSettings" size="mini" :step="0.1" v-model="settings.titleOutline" :min="0.1" />
			</div>
			<div class="row">
				<el-input size="mini" :model-value="url">
					<template #append>
						<el-button type="primary" size="mini" class="btnBase attach" @click="copy(url)">复制</el-button>
					</template>
				</el-input>
			</div>

			<div class="row">
				<div class="hint">OBS端高大于120px，宽大于400px</div>
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
	hasGift,
	isOwner
} from "@front/components/danmakuFlow/utils/tester";
import {
	getTime,
	getContent,
	getNickName,
	getGiftValue,
	getUID,
	getAvatar
} from "@front/components/danmakuFlow/utils/getter";
import { wsevent } from "@front/api/wsbus";
import { isOnline, isConnecting, init } from "@front/api/server";
import { ElMessage } from "element-plus";
import { registerRole } from "@front/util_function/base";
import { copy } from "@front/util_function/clipboard";
export default defineComponent({
	name: "messageBoard",
	cname: "留言板",
	icon: "self-question",
	description:
		"送出香蕉或礼物后，输入“留言@留言内容”进行留言，留言会一直维持到冷却时间结束或被新留言顶掉,可用于话题讨论、问答等环节。与SuperChat不同的是，冷却时间中的留言与礼物均不会被记录，所以谨慎用于礼物答谢",
	configurations: {
		width: 400,
		height: 300,
		resizable: true,
		multiple: false,
		liveOnly: false
	},
	data() {
		return {
			url: `http://${window.location.host}/obs/${this.$options.name}`,
			settings: {
				mode: 0,
				opacity: 50,
				zoom: 100,
				cooldown: 5,
				ticket: 0,
				disappearWhenCool: false,
				titleOutline: 0.8,
				blackList: []
			},
			questionList: [],
			currentQuestion: {
				id: "",
				title: "",
				nickname: "",
				avatar: ""
			},
			lastQuestionTime: 0,
			giftSended: new Set(),
			blackListRegex: "",
			settingShow: false,
			detail: false,
			detailText: "",
			owner: "",
			timer: null
		};
	},
	mounted() {
		registerRole("留言");
		registerClient(
			["changedDanmaku", "userProfile", "userSession"],
			({ changedDanmaku, userProfile, userSession }) => {
				Object.assign(this.$store.state, { userProfile, userSession });
				const output = [];
				for (const danmaku of changedDanmaku) {
					const id = getUID(danmaku);
					if (
						hasGift(danmaku) &&
						getGiftValue(danmaku) / 1000 >= this.settings.ticket
					) {
						this.giftSended.add(id);
						continue;
					}
					if (hasContent(danmaku) && this.canBeQuestion(danmaku)) {
						if (isOwner(danmaku, this.$store.state)) {
							this.owner = getContent(danmaku).replace(
								"留言@",
								""
							);
							this.ownerAddQuestion();
							return;
						}
						if (!this.giftSended.has(id)) return;
						this.giftSended.delete(id);
						output.push(danmaku);
					}
				}
				this.addQuestion(output);
			}
		);
		wsevent.on("registered", () => {
			this.upgradeSettings();
		});
		this.$emit("hasSetting", this.showSetting);
		this.registerOBS();
		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		closeWorker();
		clearTimeout(this.timer);
		this.saveSettings();
	},
	computed: {
		...mapState(["userProfile"])
	},
	methods: {
		copy,
		toTop(question, force = false) {
			this.currentQuestion = question;
			this.upgradeSettings(force);
		},
		remove(question) {
			this.questionList = this.questionList.filter(
				q => q.id !== question.id
			);
			if (this.isActive(question)) {
				this.currentQuestion = {
					title: "",
					nickname: "",
					id: 0,
					avatar: ""
				};
				this.lastQuestionTime = 0;
			}
			this.upgradeSettings();
		},
		isActive(question) {
			return question.id === this.currentQuestion?.id;
		},
		registerOBS() {
			clearTimeout(this.timer);
			if (!isOnline() && !isConnecting()) {
				init({
					onOpen: () => {
						wsevent.register(`client-${this.$options.name}`);
					}
				});
			}

			this.timer = setTimeout(() => {
				this.registerOBS();
			}, 3000);
		},
		canBeQuestion(danmaku) {
			const content = getContent(danmaku);
			let isQuestion = false;
			do {
				if (!content) break;
				if (!this.blackListRegex) this.createBLRegex();
				if (!content.includes("留言@")) {
					break;
				}
				const matches = content.match(this.blackListRegex);
				if (matches && matches[0]) break;
				isQuestion = true;
			} while (false);
			return isQuestion;
		},
		createBLRegex() {
			if (!this.settings.blackList.length) return false;
			this.blackListRegex = new RegExp(
				this.settings.blackList.join("|"),
				"g"
			);
			return true;
		},
		ownerAddQuestion() {
			if (!this.owner) {
				return;
			}
			const time = Date.now();
			const question = {
				title: this.owner,
				nickname: this.userProfile.nickname,
				id: time,
				avatar: this.userProfile.avatar
			};

			this.currentQuestion = question;
			switch (this.settings.mode) {
				case 0:
					this.questionList = [question];
					this.lastQuestionTime = time;
					break;
				default:
					this.questionList.unshift(question);
					this.lastQuestionTime = 0;
					break;
			}
			this.owner = "";
			this.upgradeSettings();
		},
		addQuestion(output) {
			if (!output.length) return;
			const time = Date.now();
			if (
				time - this.lastQuestionTime <
				this.settings.cooldown * 1000 * 60
			) {
				return;
			}

			switch (this.settings.mode) {
				case 0:
					this.currentQuestion = this.getQuestion(output[0]);
					this.questionList = [this.currentQuestion];
					this.lastQuestionTime = time;
					break;
				default:
					output.forEach(danmaku => {
						this.questionList.unshift(this.getQuestion(danmaku));
					});
					this.lastQuestionTime = 0;
					break;
			}
			this.upgradeSettings();
		},
		getQuestion(danmaku) {
			return {
				nickname: getNickName(danmaku),
				id: getTime(danmaku),
				title: getContent(danmaku).replace("留言@", ""),
				avatar: getAvatar(danmaku)
			};
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
			wsevent.wsEmit(
				`${this.$options.name}-update`,
				{
					settings: this.settings,
					lastQuestionTime: this.lastQuestionTime,
					question: this.currentQuestion
				},
				`obs-${this.$options.name}`
			);
			document.body.style.setProperty(
				"--opacity",
				this.settings.opacity / 100
			);
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
	display: flex;
	flex-direction: column;
	& > * {
		flex-shrink: 0;
	}
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
	box-sizing: border-box;
}
.row span {
	white-space: nowrap;
	flex-shrink: 0;
	font-size: 16px;
}

.question-list {
	height: calc(100vh - 110px);
	box-sizing: border-box;
	.question-row {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.question-group {
			width: calc(100% - 170px);
			position: relative;
			display: flex;
			& > * {
				width: 50%;
				white-space: nowrap;
				color: white !important;
			}
		}
		&.active {
			background-color: rgba(102, 167, 218, 0.5);
		}
	}
	overflow-y: scroll;
	padding-right: 4px;
	&:hover {
		padding-right: 0px;
	}
	&::-webkit-scrollbar {
		-webkit-appearance: none;
		width: 4px;
		border-radius: 5px;
		height: 10px;
		transition: background-color 1s;
		display: none;
	}
	&:hover {
		&::-webkit-scrollbar {
			display: block;
		}
	}

	&::-webkit-scrollbar-thumb {
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0.3);
	}

	&::-webkit-scrollbar-thumb:hover {
		background-color: rgba(0, 0, 0, 0.4);
	}

	&::-webkit-scrollbar-thumb:window-inactive {
		background-color: rgba(0, 0, 0, 0.3);
	}
}
</style>
