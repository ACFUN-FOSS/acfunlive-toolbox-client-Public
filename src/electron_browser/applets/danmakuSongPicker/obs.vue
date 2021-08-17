<template>
	<div class="outer">
		<transition name="fade" mode="out-in">
			<div :style="lyticStyle" class="lyric shadow" :key="songInfo.lyric">{{songInfo.lyric||"暂无歌词"}}</div>
		</transition>
		<title-scrolling class="song-name shadow" style="width:100%" :style="titleStyle" :label="`正在播放：${songInfo.title||'暂无播放歌曲'} ${songInfo.author?` - ${songInfo.author}`:''}`" />
	</div>
</template>

<script>
/* eslint-disable */
import { defineComponent } from "vue";
import { wsevent } from "@front/api/wsbus";
import { registerRole } from "@front/util_function/base";
import { isOnline, isConnecting, init } from "@front/api/server";
export default defineComponent({
	name: "danmakuSongPicker",
	cname: "弹幕点歌",
	icon: "el-icon-s-data",
	data() {
		return {
			songInfo: {
				title: "",
				lyric: ""
			},
			settings: {
				lyricSize: 20,
				lyricColor: "rgba(255,255,255,1)",
				lyricShadow: "rgba(0,0,0,1)",
				titleSize: 16,
				titleColor: "rgba(255,255,255,1)",
				titleShadow: "rgba(0,0,0,1)"
			}
		};
	},
	mounted() {
		registerRole("网页歌词");
		this.registerOBS();
		wsevent.on("lyric-update", e => {
			this.songInfo = e.songInfo;
			this.settings = e.settings;
		});
	},
	computed: {
		titleStyle() {
			return {
				fontSize: `${this.settings.titleSize}px !important`,
				color: `${this.settings.titleColor} !important`,
				textShadow: `${this.settings.titleShadow} -${this.settings.titleOutline}px -${this.settings.titleOutline}px 0px, ${this.settings.titleShadow} 0px -${this.settings.titleOutline}px 0px,
							 ${this.settings.titleShadow} ${this.settings.titleOutline}px -${this.settings.titleOutline}px 0px, ${this.settings.titleShadow} ${this.settings.titleOutline}px 0px 0px,
							 ${this.settings.titleShadow} ${this.settings.titleOutline}px ${this.settings.titleOutline}px 0px, ${this.settings.titleShadow} 0px ${this.settings.titleOutline}px 0px,
							 ${this.settings.titleShadow} -${this.settings.titleOutline}px ${this.settings.titleOutline}px 0px, ${this.settings.titleShadow} -${this.settings.titleOutline}px 0px 0px !important`
			};
		},
		lyticStyle() {
			return {
				fontSize: `${this.settings.lyricSize}px !important`,
				color: `${this.settings.lyricColor} !important`,
				textShadow: `${this.settings.lyricShadow} -${this.settings.lyricOutline}px -${this.settings.lyricOutline}px 0px, ${this.settings.lyricShadow} 0px -${this.settings.lyricOutline}px 0px,
							 ${this.settings.lyricShadow} ${this.settings.lyricOutline}px -${this.settings.lyricOutline}px 0px, ${this.settings.lyricShadow} ${this.settings.lyricOutline}px 0px 0px,
							 ${this.settings.lyricShadow} ${this.settings.lyricOutline}px ${this.settings.lyricOutline}px 0px, ${this.settings.lyricShadow} 0px ${this.settings.lyricOutline}px 0px,
							 ${this.settings.lyricShadow} -${this.settings.lyricOutline}px ${this.settings.lyricOutline}px 0px, ${this.settings.lyricShadow} -${this.settings.lyricOutline}px 0px 0px !important`
			};
		}
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
						wsevent.register(`obs-lyric`);
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
	font-size: 16px;

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
	justify-content: flex-end;
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
.lyric {
	font-size: 20px;
	margin-bottom: 8px;
}
.song-name {
	padding: 0px;
	color: white !important;
	white-space: nowrap;
}
</style>
