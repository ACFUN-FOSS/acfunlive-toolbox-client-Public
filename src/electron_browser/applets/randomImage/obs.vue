<template>
	<div class="outer" :style="{backgroundImage:`url(${backgroundImage})`}" />
</template>

<script>
import { defineComponent } from "vue";
import { wsevent } from "@front/api/wsbus";
import { isOnline, isConnecting, init } from "@front/api/server";
export default defineComponent({
	name: "randomImage",
	cname: "随机风景图片",
	icon: "el-icon-s-data",
	description: "输入关键词后，根据弹幕关键词进行投票",
	configurations: {
		width: 400,
		height: 300,
		resizable: true,
		multiple: false,
		liveOnly: true
	},
	data() {
		return {
			backgroundImage: ""
		};
	},
	mounted() {
		this.registerOBS();
		wsevent.on("voteUpdate", e => {
			this.backgroundImage = e.backgroundImage;
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
