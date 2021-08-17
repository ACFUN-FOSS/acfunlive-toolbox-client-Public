<template>
	<video class="outer" :src="`/videos/${videoId}.mp4`" autoplay loop controls />
</template>

<script>
import { defineComponent } from "vue";
import { wsevent } from "@front/api/wsbus";
import { isOnline, isConnecting, init } from "@front/api/server";
export default defineComponent({
	name: "randomVideo",
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
			videoId: 1
		};
	},
	mounted() {
		this.registerOBS();
		wsevent.on("voteUpdate", e => {
			this.videoId = e.videoId;
		});
		document.querySelector("body").style.padding = "0px";
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
	background-color: black;
}
</style>
