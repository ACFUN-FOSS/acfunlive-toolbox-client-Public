<template>
	<div class="outer" :class="classList[classIndex]">
		<div class="avatar" :style="{'backgroundImage':`url(${question.avatar})`,'borderColor':color}" />
		<div class="question-bar">
			<div class="username shadow" :style="{'backgroundColor':color}">
				<title-scrolling :style="{zoom:`${settings.zoom}%`,...textStyle}" class="nickname shadow" :label="question.nickname" />
				<div :style="{zoom:`${settings.zoom}%`,...textStyle}" class="remain-time" :class="{blink:remain>0&&remain<10000,shake:remain<0}" v-if="settings.mode===0">
					<template v-if="remain>0">
						剩余时间：{{miniFormat(remain)}}
					</template>
					<template v-else>
						留言可用
					</template>
				</div>
			</div>
			<div class="question shadow"><span :style="{zoom:`${settings.zoom}%`,...textStyle}">{{question.title}}</span></div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { wsevent } from "@front/api/wsbus";
import { isOnline, isConnecting, init } from "@front/api/server";
import { registerRole } from "@front/util_function/base";
export default defineComponent({
	name: "messageBoard",
	cname: "留言板",
	icon: "self-question",
	description: "送出香蕉或礼物后，可在主席台提问，问题一直维持到冷却时间结束",
	configurations: {
		width: 400,
		height: 300,
		resizable: true,
		multiple: false,
		liveOnly: true
	},
	data() {
		return {
			question: {
				nickname: "",
				avatar: "",
				title: "",
				id: 0
			},
			lastQuestionTime: 0,
			currentTime: 0,
			settings: {
				cooldown: 5,
				disappearWhenCool: false,
				mode: 0,
				titleOutline: 0.8
			},
			colorList: [
				"#f94144",
				"#f3722c",
				"#f8961e",
				"#f9844a",
				"#f9c74f",
				"#90be6d",
				"#43aa8b",
				"#4d908e",
				"#577590",
				"#277da1"
			],
			colorIndex: 0,
			classIndex: 0,
			classList: ["", "active", "inactive"],
			timer: null,
			timeCounter: null
		};
	},
	computed: {
		color() {
			return this.colorList[this.colorIndex];
		},
		remain() {
			return (
				this.settings.cooldown * 60 * 1000 -
				this.currentTime +
				this.lastQuestionTime
			);
		},
		textStyle() {
			return {
				textShadow: `#000 -${this.settings.titleOutline}px -${this.settings.titleOutline}px 0px, #000 0px -${this.settings.titleOutline}px 0px,
							 #000 ${this.settings.titleOutline}px -${this.settings.titleOutline}px 0px, #000 ${this.settings.titleOutline}px 0px 0px,
							 #000 ${this.settings.titleOutline}px ${this.settings.titleOutline}px 0px, #000 0px ${this.settings.titleOutline}px 0px,
							 #000 -${this.settings.titleOutline}px ${this.settings.titleOutline}px 0px, #000 -${this.settings.titleOutline}px 0px 0px !important`
			};
		}
	},
	watch: {
		remain(n, o) {
			if (o > 0 && n < 0 && this.settings.disappearWhenCool) {
				if (this.classIndex === 1) {
					this.classIndex = 2;
				}
			}
		}
	},
	mounted() {
		registerRole("留言网页端");
		this.registerOBS();
		this.timeCounter = setInterval(() => {
			this.currentTime = Date.now();
		}, 1000);
		wsevent.on(`${this.$options.name}-update`, e => {
			clearTimeout(this.timer);
			const { settings, question, lastQuestionTime } = e;
			this.settings = settings;
			if (question.id && question.id === this.question.id) {
				return;
			}
			if (this.classIndex === 1) {
				this.classIndex = 2;
			}
			if (!question.id) {
				return;
			}

			this.timer = setTimeout(() => {
				this.colorIndex = parseInt(
					Math.random() * this.colorList.length
				);
				this.question = question;
				this.lastQuestionTime = lastQuestionTime;
				this.classIndex = 1;
			}, 1000);
		});
	},
	beforeUnmount() {
		clearTimeout(this.timer);
	},
	methods: {
		miniFormat(time) {
			time = parseInt(time / 1000);
			return `${String(parseInt(time / 60)).padStart(2, "0")}:${String(
				time % 60
			).padStart(2, "0")}`;
		},
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
* {
	box-sizing: border-box;
}
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
.outer {
	position: relative;
}
.question-bar {
	position: absolute;
	width: calc(100% - 50px);
	top: 0px;
	left: 0px;
	z-index: 1;
	margin-left: 50px;

	.username {
		width: 0%;
		padding: 5px 0px;
		padding-left: 0px;
		font-size: 18px;
		white-space: nowrap;
		border-radius: 0 20px 0 0;
		overflow: hidden;
		position: relative;
		display: flex;
		align-items: center;
	}
	.nickname {
		color: white;
		font-size: 18px;
		flex-grow: 1;
		white-space: nowrap !important;
	}
	.question {
		width: 100%;
		height: 0px;
		padding: 0px 0px 0px 55px;
		background-color: white;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px;
		transition: height 1s;
	}
}
.avatar {
	width: 100px;
	height: 100px;
	background-size: 100% 100%;
	border-radius: 100%;
	border-width: 7px;
	border-style: solid;
	position: relative;
	opacity: 0;
	z-index: 2;
	box-shadow: 0 2px 3px rgba(0, 0, 0, 0.12), 0 0 4px;
}
.remain-time {
	white-space: nowrap;
	padding: 0px 8px;
	font-size: 16px;
	width: 140px;
	flex-shrink: 0;
}
.normal {
	.avatar {
		opacity: 0;
		transform: scale(20%);
	}
}
.active {
	.avatar {
		animation: avatarActive 0.7s ease-in forwards;
	}
	.username {
		animation: usernameActive 0.3s 0.6s ease-in forwards;
	}
	.question {
		animation: questionActive 0.1s 0.9s ease-in forwards;
	}
}
.inactive {
	.avatar {
		opacity: 1;
		animation: avatarInactive 0.5s 0.6s ease-out forwards;
	}
	.username {
		width: 100%;
		animation: usernameInactive 0.3s 0.2s ease-in forwards;
	}
	.question {
		height: fit-content;
		padding: 6px 0px 6px 55px;
		animation: questionInactive 0.1s ease-out forwards;
	}
}
@keyframes avatarActive {
	0% {
		opacity: 0;
		transform: scale(0.4) rotate(-180deg);
	}
	90% {
		opacity: 1;
		transform: scale(1.2) rotate(0deg);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}
@keyframes avatarInactive {
	0% {
		opacity: 1;
		transform: scale(1) rotate(0deg);
	}
	100% {
		opacity: 0;
		transform: scale(0.8) rotate(-180deg);
	}
}
@keyframes usernameActive {
	0% {
		width: 0%;
		padding-left: 0px;
		white-space: nowrap;
	}
	100% {
		width: 100%;
		padding-left: 55px;
		white-space: normal;
	}
}
@keyframes usernameInactive {
	0% {
		width: 100%;
		padding-left: 55px;
		white-space: normal;
	}
	100% {
		width: 0%;
		padding-left: 0px;
		white-space: nowrap;
	}
}
@keyframes questionActive {
	0% {
		height: 0px !important;
		padding: 0px;
	}
	100% {
		height: fit-content;
		padding: 6px 0px 6px 55px;
	}
}
@keyframes questionInactive {
	0% {
		height: fit-content;
		padding: 6px 0px 6px 55px;
	}
	100% {
		height: 0px;
		padding: 0px;
	}
}
.blink {
	animation: blink 1s infinite;
}
@keyframes blink {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
.shake {
	animation: shake 2s infinite;
	width: 80px;
}
@keyframes shake {
	0% {
		transform: scale(1);
	}
	25% {
		transform: scale(1.1);
	}
	50% {
		transform: scale(1);
	}
	75% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
}
</style>
