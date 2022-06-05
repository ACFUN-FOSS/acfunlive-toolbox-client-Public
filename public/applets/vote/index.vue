<template>
	<div class="outer" v-loading="loading" :style="{backgroundImage:`url(${settings.backgroundImage})`}">
		<div class="title shadow">{{status==='setting'?"设置投票参数":`弹幕投票：${settings.title}`}}</div>
		<div class="votePanel" v-show="status=='setting'">
			<div class="row">
				<span class="shadow">标题</span>
				<el-input size="mini" v-model="settings.title" />
			</div>
			<div class="row" v-for="(item,index) in voteItem" :key="index">
				<span class="shadow">选项{{index+1}}</span>
				<el-input size="mini" v-model="item.keyword" :maxlength="10" placeholder="不要输入标点符号,最多10字" />
				<el-button size="mini" @click="voteItem = voteItem.filter(i=>i!==item)">删除</el-button>
			</div>
			<div class="row">
				<span class="shadow">去重</span>
				<el-switch v-model="settings.norepeat" />
			</div>
			<!-- <div class="row">
				<el-input size="mini" :model-value="url">
					<template #append>
						<el-button type="primary" size="mini" class="btnBase attach" @click="copy(url)">复制</el-button>
					</template>
				</el-input>
			</div> -->
			<div class="row">
				<el-button size="mini" v-if="voteItem.length<maxNum" type="primary" @click="addItem">
					点击添加（剩余可添加{{maxNum-voteItem.length}}）</el-button>

				<el-button size="mini" type="primary" @click="status='voting'" :disabled="voteItem.length<2">开始投票
				</el-button>

			</div>
		</div>
		<div class="votePanel" v-if="['voting','voted'].includes(status)">
			<div class="graph">
				<div class="set" v-for="(item,index) in voteItem" :key="index"
					:style="{'width':`${100/voteItem.length}%`}">
					<span class="shadow">{{item.count}}</span>
					<div class="column" :style="{'height':`${item.count?item.count*100/max:0}%`}"
						@click="showIndex=index;voterShow=true" />
					<span class="shadow">{{item.keyword}}</span>
				</div>
			</div>
			<div class="row">
				<el-button size="mini" type="primary" @click="status='voted'" v-show="status==='voting'">停止计票
				</el-button>
				<el-button size="mini" type="primary" v-show="status=='voted'" disabled>点击柱形图查看投票人</el-button>
				<el-button size="mini" type="primary" v-show="status=='voted'" @click="reset">重新投票</el-button>
			</div>
		</div>
		<el-dialog :settings.title="`投${voteItem[showIndex]?voteItem[showIndex].keyword:''}的观众列表`" v-model="voterShow">
			<div class="block" v-for="(person,index) in voteItem[showIndex].person" :key="index">
				{{person}}
			</div>
		</el-dialog>
		<el-dialog v-model="setting">
			<div class="block">
				<div>背景图片</div>
				<img-input-static v-model="settings.backgroundImage" />
			</div>
			<!-- <div class="block">
				<div>不透明度</div>
				<el-slider @change="upgradeSettings" v-model="settings.opacity" :min="10" :max="100" />
			</div>
			<div class="block">
				<div>OBS文字缩放</div>
				<el-slider @change="upgradeSettings" v-model="settings.zoom" :min="50" :max="300" />
			</div> -->
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: "danmakuVote",
	data() {
		return {
			loading: false,
			setting: false,
			voterShow: false,
			status: "setting",
			voteItem: [],
			maxNum:10,
			voteUserID: [],
			// url: `http://${window.location.host}/obs/${this.$options.name}`,
			regexp: "",
			showIndex: 0,
			settings: {
				title: "",
				voteItem: [],
				opacity: 50,
				zoom: 100,
				norepeat: false,
				backgroundImage: "",
			},
			timer: null,
		};
	},
	mounted() {
		const { hasContent } = this.s_danmakuTesters;
		this.s_registerClient(["changedDanmaku"], ({ changedDanmaku }) => {
			if (this.status === "voting") {
				this.addVote(
					changedDanmaku.filter((danmaku) => hasContent(danmaku))
				);
			}
		});
		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		clearTimeout(this.timer);
		this.saveSettings();
	},
	computed: {
		max() {
			return Math.max(
				...this.voteItem.map((item) => {
					return item.count;
				})
			);
		},
	},
	watch: {
		settings() {
			this.saveSettings();
		},
		voteItem: {
			handler(n, o) {
				console.log(1);
				if (this.status !== "setting") return;
				this.settings.voteItem = n.map(({ keyword }) => {
					return {
						keyword,
						count: 0,
						person: [],
					};
				});
				this.saveSettings();
			},
			deep: true,
		},
	},
	methods: {
		reset() {
			this.status = "setting";
			this.regexp = "";
			this.giftSended = [];
			this.voteUserID = [];
			this.voteItem.forEach((item) => {
				item.person = [];
				item.count = 0;
			});
		},
		generateTester() {
			const testerArr = this.voteItem.map((item) => {
				return "投票@" + item.keyword;
			});
			testerArr.sort((a, b) => b.length - a.length);
			this.regexp = new RegExp(testerArr.join("|"), "g");
		},
		addVote(danmakus) {
			if (!this.regexp) this.generateTester();
			const { getUID, getContent, getNickName } = this.s_danmakuGetters;
			danmakus.forEach((danmaku) => {
				const uid = getUID(danmaku);
				if (this.settings.norepeat && this.voteUserID.includes(uid)) {
					return;
				}
				const content = getContent(danmaku).match(this.regexp);
				if (!content) return;
				content.sort((a, b) => b.length - a.length);

				const found = this.voteItem.find(
					(item) => item.keyword === content[0].replace("投票@", "")
				);
				if (found) {
					found.count++;
					found.person.push(getNickName(danmaku));
					this.voteUserID.push(uid);
				}
			});
		},
		addItem() {
			this.voteItem = [
				...this.voteItem,
				{
					keyword: "",
					count: 0,
					person: [],
				},
			];
		},
		loadSettings() {
			this.s_loadSettings().then((res) => {
				if (res) {
					Object.assign(this.settings, res);
				}
				if (res?.voteItem) this.voteItem = res.voteItem;
			});
		},
		saveSettings() {
			this.s_saveSettings(this.settings);
		},
	},
};
</script>
<style scoped >
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
