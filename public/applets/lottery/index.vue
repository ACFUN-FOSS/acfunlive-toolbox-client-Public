<template>
	<div
		class="outer"
		v-loading="loading"
		:style="{ backgroundImage: `url(${settings.backgroundImage})` }"
	>
		<div class="title shadow">
			{{
				status === "setting"
					? "设置抽奖参数"
					: `弹幕抽奖：${settings.title}`
			}}
		</div>
		<div class="votePanel" v-show="status == 'setting'">
			<div class="row">
				<span class="shadow">奖品</span>
				<el-input
					size="mini"
					v-model="settings.title"
					style="margin-left: 8px"
				/>
			</div>
			<div class="row">
				<span class="shadow">选择抽奖类型</span>
				<el-select
					size="mini"
					v-model="settings.lotteryType"
					max-height="100px"
				>
					<el-option value="keyword" label="关键词抽奖" />
					<el-option value="gift" label="送出指定礼物抽奖" />
				</el-select>
			</div>
			<div class="row">
				<span class="shadow">是否在粉丝团中抽奖（必须带上粉丝牌）</span>
				<el-switch v-model="settings.shouldHaveMedal" />
			</div>
			<div class="row">
				<span class="shadow">显示中奖概率</span>
				<el-switch v-model="settings.showChance" />
			</div>
			<div class="row">
				<span class="shadow">显示奖池人员</span>
				<el-switch v-model="settings.showPoolName" />
			</div>
			<div class="row">
				<span class="shadow">抽奖倒计时(分钟)</span>
				<el-input-number
					size="mini"
					v-model="settings.countDown"
					:precision="1"
					step="1"
				></el-input-number>
			</div>
			<div class="row" v-if="settings.lotteryType === 'gift'">
				<span class="shadow">选择礼物</span>
				<el-select
					size="mini"
					v-model="settings.giftName"
					class="drop-down-maxHeight"
				>
					<el-option
						v-for="gift in gifts"
						:key="gift.giftID"
						:value="gift.giftName"
						:label="gift.giftName"
					/>
				</el-select>
			</div>
			<div class="row" v-if="settings.lotteryType === 'keyword'">
				<span class="shadow">输入关键词</span>
				<el-input
					size="mini"
					v-model="settings.keyword"
					:maxlength="10"
					placeholder="不要输入标点符号,最多10字"
					style="margin-left: 8px"
				/>
			</div>
			<div class="row">
				<span class="shadow">输入奖品数量</span>
				<el-input-number size="mini" v-model="lotteryNum" :min="1" />
			</div>
			<div class="row">
				<span class="shadow">是否需要大逃杀</span>
				<el-switch size="mini" v-model="settings.enableBattleRoyale" />
			</div>
			<div class="row">
				<el-button size="mini" type="primary" @click="start"
					>开始抽奖</el-button
				>
			</div>
		</div>
		设置抽奖参数
		<div class="votePanel" v-show="status === 'InProgress'">
			<div class="row">
				<span class="shadow" v-if="settings.lotteryType === 'keyword'"
					>输入关键词“{{ settings.keyword }}”参与抽奖</span
				>
				<span class="shadow" v-else
					>送出一个 “{{ settings.giftName }}”参与抽奖</span
				>
			</div>
			<div class="row">
				<span class="shadow"
					>已有{{ lotteryPool.length }}人加入奖池</span
				>
			</div>
			<div class="row" v-if="settings.showPoolName">
				<div class="shadow" style="word-break: break-all; width: 100%">
					{{ lotteryPool.map(i => i.nickName).join("、") }}
				</div>
			</div>
			<div class="row">
				<span class="shadow" v-show="settings.showChance"
					>抽取{{ lotteryNum }}人，当前中奖率{{ rate }}</span
				>
			</div>
			<div class="row" v-show="settings.countDown">
				<span class="shadow">{{ countDownText }}后自动开奖</span>
			</div>
			<div
				:style="
					`height: calc(100% - 147px - ${
						settings.countDown ? '40px' : '0'
					})`
				"
			></div>
			<div class="row">
				<el-button
					size="mini"
					type="primary"
					@click="getLucky()"
					style="width: 100%"
					>开奖</el-button
				>
			</div>
		</div>
		<div
			class="votePanel"
			v-show="['Resulting', 'Resulted'].indexOf(status) > -1"
		>
			<div
				class="row"
				style="height: calc(100% - 54px); position: relative"
			>
				<div style="height: 100%; width: 100%; overflow-y: auto">
					<div
						style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 8px"
						v-for="user in luckyPool"
						:key="user.userID"
					>
						<span class="shadow">{{ user.nickName }}</span>
						<el-button
							size="mini"
							type="primary"
							v-show="!user.pending"
							@click="open(user.userID)"
							>个人主页
						</el-button>
					</div>
				</div>
			</div>
			<div class="row">
				<el-button
					size="mini"
					type="primary"
					@click="reset"
					:disabled="status == 'Resulting'"
					style="width: 100%"
				>
					{{ status == "Resulting" ? "开奖中" : "重新抽" }}</el-button
				>
				<el-button
					size="mini"
					type="primary"
					@click="save(luckyPool)"
					:disabled="status == 'Resulting'"
					style="width: 100%"
				>
					保存结果</el-button
				>
				<el-button
					size="mini"
					type="danger"
					@click="startBattleRoyale()"
					v-show="settings.enableBattleRoyale"
					>开始大逃杀</el-button
				>
			</div>
		</div>
		<div class="votePanel" v-show="status === 'battleRoyale'">
			<div class="row">
				<el-button
					size="mini"
					type="danger"
					@click="kill(1)"
					style="flex: 1"
					>杀一个</el-button
				>
				<el-button
					size="mini"
					type="danger"
					@click="
						kill(Math.floor(battleRoyaleSettings.list.length / 2))
					"
					style="flex: 1"
					>杀一半</el-button
				>
				<el-button
					size="mini"
					type="danger"
					@click="kill(battleRoyaleSettings.list.length - 1)"
					style="flex: 1"
					>剩一个</el-button
				>
			</div>
			<div class="row" style="height: calc(100% - 100px)">
				<div class="result-list">
					<div
						v-for="user in battleRoyaleSettings.list"
						:key="user.userID"
						:class="
							`participator ${
								battleRoyaleSettings.dying.includes(user)
									? 'dying'
									: ''
							}`
						"
					>
						<span class="shadow" style="margin-bottom: 0">{{
							user.nickName
						}}</span>
						<el-button
							size="mini"
							type="primary"
							@click="open(user.userID)"
							>个人主页</el-button
						>
					</div>
				</div>
			</div>
			<div class="row">
				<el-button
					size="mini"
					type="primary"
					@click="reset"
					style="width: 100%"
					>重新抽</el-button
				>
				<el-button
					size="mini"
					type="primary"
					@click="save(battleRoyaleSettings.list)"
					style="width: 100%"
					>保存结果</el-button
				>
			</div>
		</div>
		<el-dialog v-model="setting">
			<div class="block">
				<div>背景图片</div>
				<img-input-static v-model="settings.backgroundImage" />
			</div>
			<!-- <div class="block">
				<div>不透明度</div>
				<el-slider @change="upgradeSettings" v-model="settings.opacity" :min="10" :max="100" />
			</div> -->
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: "lottery",
	data() {
		return {
			loading: false,
			setting: false,
			status: "setting",
			lotteryNum: 1,
			lotteryPool: [],
			luckyPool: [],
			regexp: "",
			gifts: [],
			timeLast: 0,
			countDownStartTime: 0,
			settings: {
				title: "",
				showChance: true,
				giftName: "",
				keyword: "",
				opacity: 50,
				zoom: 100,
				lotteryType: "keyword",
				showPoolName: true,
				shouldHaveMedal: false,
				backgroundImage: "",
				countDown: undefined,
				enableBattleRoyale: false
			},
			// 大逃杀设定
			battleRoyaleSettings: {
				dying: [],
				list: []
			}
		};
	},
	mounted() {
		this.s_registerClient(
			["changedDanmaku", "userProfile", "roomProfile", "userSession"],
			({ changedDanmaku, userProfile, roomProfile, userSession }) => {
				this.s_apis.loginSession(userSession);
				if (!this.gifts.length && userSession.serviceToken) {
					this.loading = true;
					setTimeout(() => {
						this.getGift().finally(() => {
							this.loading = false;
						});
					}, 1000);
				}
				Object.assign(this.$store.state, {
					userProfile,
					roomProfile,
					userSession
				});
				const { hasGift, hasContent } = this.s_danmakuTesters;
				const tester =
					this.settings.lotteryType === "gift" ? hasGift : hasContent;
				this.addPool(changedDanmaku.filter(danmaku => tester(danmaku)));
			}
		);

		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		this.saveSettings();
	},
	watch: {
		settings(n, o) {
			this.saveSettings();
		}
	},
	computed: {
		userProfile() {
			return this.$store.state.userProfile;
		},
		roomProfile() {
			return this.$store.state.roomProfile;
		},
		userSession() {
			return this.$store.state.userSession;
		},
		rate() {
			if (this.lotteryPool.length <= this.lotteryNum) {
				return "100%";
			}
			return (
				((this.lotteryNum * 100) / this.lotteryPool.length).toFixed(2) +
				"%"
			);
		},
		countDownText() {
			const minutes = Math.floor(this.timeLast / 60);
			const seconds = this.timeLast % 60;
			return `${minutes ? `${minutes}分` : ""}${seconds}秒`;
		}
	},
	methods: {
		handleCountDown() {
			this.countDownStartTime = new Date().valueOf();
			const recur = () => {
				if (this.status === "setting") {
					return;
				}
				// 还剩多少秒
				const seconds = Math.floor(
					(this.countDownStartTime +
						this.settings.countDown * 60 * 1000 -
						new Date().valueOf()) /
						1000
				);
				if (seconds <= 0) {
					this.timeLast = 0;
					this.getLucky();
				} else {
					this.timeLast = seconds;
					setTimeout(recur, 100);
				}
			};
			recur();
		},
		toCSV(name, array) {
			const str =
				"\uFEFF" +
				array
					.map(e => {
						try {
							return e.join(",");
						} catch (error) {
							console.log(e);
						}
						return "";
					})
					.join("\n");
			const a = window.document.createElement("a");

			a.href = window.URL.createObjectURL(
				new Blob([str], { type: "text/plain;charset=utf-8" }),
				{
					type: "text/plain"
				}
			);
			a.download = `${name}.csv`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		},
		save(list) {
			const header = ["uid", "用户名", "中奖弹幕"];
			const output = [header, ...list.map(i => Object.values(i))];
			this.toCSV(
				`${new Date().toTimeString()} 抽奖结果 (奖品:${
					this.settings.title
				})`,
				output
			);
		},
		open(uid) {
			window.open(`https://www.acfun.cn/u/${uid}`);
		},
		start() {
			this.status = "InProgress";
			if (this.settings.countDown) {
				this.handleCountDown();
			}
		},
		reset() {
			this.lotteryPool = [];
			this.luckyPool = [];
			this.battleRoyaleSettings.dying = [];
			this.battleRoyaleSettings.list = [];
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
				const select = this.s_lodash.random(0, pool.length - 1);
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
					...pool[this.s_lodash.random(0, pool.length - 1)],
					pending: true
				};
				this.luckyPool = [...this.luckyPool];
			}
			requestAnimationFrame(() => {
				this.getLucky(currentSelected, firstTime, pool);
			});
		},
		async getGift() {
			const res = await this.s_apis.getGiftList({
				liveID: this.roomProfile.liveID
			});
			this.gifts = res;
		},
		generateTester() {
			const testerArr = this.voteItem.map(item => {
				return item.keyword;
			});
			this.regexp = new RegExp(testerArr.join("|"), "g");
		},
		addPool(danmakus) {
			if (this.status !== "InProgress") return;
			const {
				getUID,
				getGiftName,
				getContent,
				getMedal,
				getNickName
			} = this.s_danmakuGetters;
			danmakus.forEach(danmaku => {
				const uid = getUID(danmaku);
				if (this.lotteryPool.find(user => user.userID === uid)) {
					return;
				}
				// if (this.$store.state.userProfile?.userID === uid) return;
				let shouldadd = false;
				switch (this.settings.lotteryType) {
					case "gift":
						shouldadd =
							getGiftName(danmaku) === this.settings.giftName;
						break;
					case "keyword":
						shouldadd = Boolean(
							getContent(danmaku)?.match(
								this.settings.keyword.trim()
							)
						);
				}

				if (
					this.settings.shouldHaveMedal &&
					getMedal(danmaku)?.uperID !==
						this.$store.state.userProfile?.userID
				) {
					shouldadd = false;
				}

				if (shouldadd) {
					this.lotteryPool = [
						...this.lotteryPool,
						{
							userID: getUID(danmaku),
							nickName: getNickName(danmaku),
							danmaku: getContent(danmaku)
						}
					];
				}
			});
		},
		loadSettings() {
			this.s_loadSettings().then(res => {
				if (res) {
					Object.assign(this.settings, res);
				}
			});
		},
		saveSettings() {
			this.s_saveSettings(this.settings);
		},
		// 大逃杀逻辑
		startBattleRoyale() {
			this.status = "battleRoyale";
			this.battleRoyaleSettings.list = [...this.luckyPool];
		},
		kill(num) {
			let count = num;
			// eslint-disable-next-line init-declarations
			let timer;
			while (count > 0) {
				const index = Math.floor(
					Math.random() * this.battleRoyaleSettings.list.length
				);
				const item = this.battleRoyaleSettings.list[index];
				if (!this.battleRoyaleSettings.dying.includes(item)) {
					this.battleRoyaleSettings.dying.push(item);
					count--;
					if (timer) {
						clearInterval(timer);
					}
					timer = setTimeout(() => {
						this.battleRoyaleSettings.list = this.battleRoyaleSettings.list.filter(
							i => !this.battleRoyaleSettings.dying.includes(i)
						);
					}, 700);
				}
			}
		}
	}
};
</script>
<style scoped>
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
	display: inline-flex;
	align-content: center;
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
	height: calc(100% - 70px);
	overflow-y: auto;
}
.result-list {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow-y: auto;
	padding: 2px 2px;
	width: 100%;
}
.participator {
	margin-bottom: 8px;
	border-radius: 4px;
	padding: 2px 0 2px 6px;
	display: flex;
	justify-content: space-between;
	align-content: center;
}
@keyframes dying {
	0% {
		background: none;
	}
	50% {
		background: red;
		color: white;
	}
	100% {
		background: none;
	}
}
.dying {
	animation: dying 0.7s linear;
}
</style>
