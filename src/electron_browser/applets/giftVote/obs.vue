<template>
	<div class="outer" :style="{backgroundImage:`url(${backgroundImage})`,zoom:`${zoom}%`}">
		<div class="title shadow" v-if="status!='setting'">{{`礼物投票：${title}`}}<span v-if="status=='voted'">(投票已结束)</span></div>
		<div class="votePanel" v-if="status=='setting'">
			<div class="title shadow">投票未开始</div>
		</div>
		<div class="graph" v-if="['voting','voted'].includes(status)">
			<div class="set" v-for="(item,index) in voteItem" :key="index" :style="{'width':`${100/voteItem.length}%`}">
				<span class="shadow">{{item.count}}</span>
				<div class="column" :style="{'height':`${item.count?item.count*100/max:0}%`}" @click="showIndex=index;voterShow=true" />
				<span class="shadow">{{item.keyword}}</span>
			</div>
		</div>
		<div class="shadow" style="text-align:center;padding:0px;8px" v-if="status=='voting'">送出 {{giftName}} 后即可打出“投票@选项”参与投票,每人一票</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { wsevent } from "@front/api/wsbus";
import { isOnline, isConnecting, init } from "@front/api/server";
export default defineComponent({
	name: "danmakuGiftVote",
	cname: "弹幕礼物投票",
	icon: "el-icon-s-data",
	description: "输入关键词后，观众打出“投票@关键词”进行投票",
	configurations: {
		width: 400,
		height: 300,
		resizable: true,
		multiple: false,
		liveOnly: true
	},
	data() {
		return {
			status: "setting",
			title: "",
			voteItem: [],
			backgroundImage: "",
			max: 1,
			giftName: "",
			zoom: 100,
			timer: null
		};
	},
	mounted() {
		this.registerOBS();
		wsevent.on("voteUpdate", e => {
			this.status = e.status;
			this.title = e.title;
			this.voteItem = e.voteItem;
			this.backgroundImage = e.backgroundImage;
			this.giftName = e.giftName;
			this.max = e.max || 1;
			this.zoom = e.zoom;
		});
	},
	beforeUnmount() {
		clearTimeout(this.timer);
	},
	methods: {
		registerOBS() {
			clearTimeout(this.timer);
			if (!isOnline() && !isConnecting()) {
				init({
					onOpen: () => {
						wsevent.register(`obs-${this.$options.name}`);
					}
				});
			}
			this.timer = setTimeout(() => {
				this.registerOBS();
			}, 3000);
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
	box-sizing: border-box;
	padding-top: 10px;
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
	display: flex;
	overflow-y: auto;
}
</style>
