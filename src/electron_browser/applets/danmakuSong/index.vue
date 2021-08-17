<template>
	<div class="outer">
		<row-frame class="rowframe" title="待唱" contentClass="list">
			<div class="song-row" v-for="song in pending" :key="song.title">
				<div class="song-name">
					<title-scrolling :label="song.title" />
					<title-scrolling :label="song.nickname" />
				</div>

				<el-button-group>
					<el-button class="btn" size="mini" @click="copy(song.title);" type="primary">复制</el-button>
					<el-button class="btn" size="mini" @click="addToBlackList(song)">不想唱</el-button>
					<el-button class="btn" size="mini" @click="pass(song)">唱过了</el-button>
				</el-button-group>
			</div>
		</row-frame>
		<row-frame class="rowframe" title="已唱" contentClass="list">
			<div class="song-row" v-for="song in sang" :key="song.title">
				<div class="song-name">
					<title-scrolling :label="song.title" />
					<title-scrolling :label="song.nickname" />
				</div>
				<el-button-group>
					<el-button class="btn" size="mini" @click="sang = sang.filter(i=>i!==song)">移出</el-button>
				</el-button-group>
			</div>
		</row-frame>
		<row-frame class="rowframe" title="不想唱" contentClass="list">
			<div class="song-row" v-for="song in settings.nosing" :key="song">
				<div class="song-name">
					<title-scrolling :label="song" />
				</div>
				<el-button-group>
					<el-button class="btn" size="mini" @click="settings.nosing = settings.nosing.filter(i=>i!==song)">移出</el-button>
				</el-button-group>
			</div>
		</row-frame>
		<el-dialog v-model="settingShow">
			<div class="row">
				<span class="shadow">冷却时间</span>
				<el-input-number size="mini" v-model="settings.coolingTime" :min="0" />
			</div>
			<div class="row">
				<span class="hint">单位为分钟，限制同一人频繁点歌</span>
			</div>
			<span class="hint">推荐尺寸：400px x 100px</span><br>
		</el-dialog>

	</div>
</template>

<script>
/* eslint-disable */
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { registerClient, closeWorker } from "@front/util_function/storeWorker";
import {
	getContent,
	getUID,
	getTime,
	getNickName
} from "@front/components/danmakuFlow/utils/getter";
import { hasContent } from "@front/components/danmakuFlow/utils/tester";
import { wsevent } from "@front/api/wsbus";
import { isOnline, isConnecting, init } from "@front/api/server";
import { copy } from "@front/util_function/clipboard";
export default defineComponent({
	name: "danmakuSong",
	cname: "歌回助手",
	icon: "el-icon-microphone",
	description:
		'简单的点歌记录工具，观众输入"点歌@歌曲名@"进行点歌，会合并同名请求，右上角设置提供冷却时间设置',
	configurations: {
		width: 350,
		height: 600,
		resizable: true,
		multiple: false,
		liveOnly: false
	},
	data() {
		return {
			pending: [],
			sang: [],
			cooling: [],
			settings: {
				coolingTime: 1,
				nosing: []
			},
			songInfo: {
				title: "",
				lyric: ""
			},
			url: `http://${window.location.host}/obs/${this.$options.name}`,
			settingShow: false
		};
	},
	mounted() {
		registerClient(
			["changedDanmaku", "userProfile"],
			({ changedDanmaku, userProfile }) => {
				Object.assign(this.$store.state, { userProfile });
				this.addSong(
					changedDanmaku.filter(danmaku => hasContent(danmaku))
				);
			}
		);
		this.$emit("hasSetting", this.showSetting);
		this.registerOBS();
		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		closeWorker();
		clearTimeout(this.timer);
	},
	computed: {
		...mapState(["userProfile"])
	},
	methods: {
		copy,
		addToBlackList(song) {
			if (!this.settings.nosing.includes(song.title)) {
				this.settings.nosing = [song.title, ...this.settings.nosing];
			}
			this.pending = this.pending.filter(i => song !== i);
		},
		pass(song) {
			if (!this.hasSong(this.sang, song)) {
				this.sang = [song, ...this.sang];
			}
			this.cooling = this.pending = this.pending.filter(i => i !== song);
		},
		hasSong(songList, song) {
			return Boolean(songList.find(i => song.title === i.title));
		},
		registerOBS() {
			clearTimeout(this.timer);
			if (!isOnline() && !isConnecting()) {
				init({
					onOpen: () => {
						wsevent.register(`client-${this.$options.name}`);
						this.wsUpdate();
					}
				});
			}

			this.timer = setTimeout(() => {
				this.registerOBS();
			}, 3000);
		},
		wsUpdate() {
			wsevent.wsEmit(
				`lyric-update`,
				{
					songInfo: this.songInfo,
					settings: this.settings
				},
				`obs-lyric`
			);
		},
		addSong(danmakus) {
			const time = Date.now();
			this.cooling = this.cooling.filter(
				i => time - i.time < 1000 * 60 * this.settings.coolingTime
			);
			danmakus.forEach(danmaku => {
				const uid = getUID(danmaku);
				if (this.cooling.find(i => i.userID === uid)) {
					return;
				}

				const content = getContent(danmaku);
				const nickname = getNickName(danmaku);
				if (!content || !content.includes("点歌")) return;
				let songName = content.split(/@/)[1];
				if (!songName) return;
				songName = songName.trim();
				if (
					this.hasSong(this.sang, { title: songName }) ||
					this.settings.nosing.includes(songName)
				) {
					return;
				}
				const newSong = {
					userID: uid,
					content,
					nickname,
					title: songName,
					time
				};
				this.pending = [newSong, ...this.pending];
				this.cooling = [newSong, ...this.cooling];
			});
		},
		showSetting() {
			this.settingShow = !this.settingShow;
		},
		loadSettings() {
			let settings = localStorage.getItem(`applet$${this.$options.name}`);
			if (settings) {
				try {
					settings = JSON.parse(settings);
					Object.assign(this.settings, settings);
				} catch (error) {}
			}

			this.upgradeSettings();
		},
		upgradeSettings() {
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
.song-row {
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 8px;
	align-items: center;
	.song-name {
		flex-grow: 1;
		flex-shrink: 1 !important;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: flex;

		& > div {
			margin-right: 8px;
			width: calc(50% - 8px);
		}
	}
	& > * {
		flex-shrink: 0;
	}
	.btn {
		padding: 0px 4px !important;
	}
}
.rowframe {
	box-sizing: border-box;
	width: 100% !important;
	height: calc(100% / 3 - 16px);
	padding: 4px;
	flex-shrink: 0;
	&:deep .list {
		height: calc(100% - 24px);
		width: 100%;
		position: relative;
		overflow-y: auto;
		padding-right: 4px;
		box-sizing: border-box;
		overflow-y: scroll;

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
}
.outer {
	position: absolute;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
	background-color: whitesmoke;
	display: flex;
	align-content: stretch;
	flex-direction: column;
	border: 2px solid grey;
	.left {
		width: calc(100% - 250px);
	}
	.right {
		width: 250px;
		height: 100%;
		position: relative;
	}
}
.block {
	padding: 0px 16px;
	width: calc(100% - 32px);
}

.row {
	box-sizing: border-box;
	justify-content: space-between;
	display: flex;
	align-items: center;
	padding: 0px 16px 8px 16px;
}
.row span {
	white-space: nowrap;
	flex-shrink: 0;
	font-size: 16px;
}
</style>
