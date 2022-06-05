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
					<el-button class="btn" size="mini" @click="settings.nosing = settings.nosing.filter(i=>i!==song)">移出
					</el-button>
				</el-button-group>
			</div>
		</row-frame>
		<el-dialog v-model="setting">
			<div class="settings">
				<el-row>
					<el-col :span="6">关键词</el-col>
					<el-col :span="18" style="text-align:right">
						<el-input size="mini" v-model="settings.keyWord" />
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">冷却时间</el-col>
					<el-col :span="18" style="text-align:right">
						<el-input-number size="mini" v-model="settings.coolingTime" :min="0" />
					</el-col>
				</el-row>
				<div class="row">
					<span class="hint">单位为分钟，限制同一人频繁点歌</span>
				</div>
			</div>
		</el-dialog>

	</div>
</template>

<script>
export default {
	name: "danmakuSong",
	data() {
		return {
			pending: [],
			sang: [],
			cooling: [],
			settings: {
				coolingTime: 1,
				nosing: [],
				keyWord: "点歌"
			},
			songInfo: {
				title: "",
				lyric: ""
			},
			setting: false
		};
	},
	mounted() {
		this.s_registerClient(
			["changedDanmaku", "userProfile"],
			({ changedDanmaku, userProfile }) => {
				Object.assign(this.$store.state, { userProfile });
				this.addSong(
					changedDanmaku.filter(danmaku =>
						this.s_danmakuTesters.hasContent(danmaku)
					)
				);
			}
		);
		this.loadSettings();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		clearTimeout(this.timer);
	},
	computed: {
		userProfile() {
			return this.$store.state.userProfile;
		}
	},
	methods: {
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
		// wsUpdate() {
		// 	wsevent.wsEmit(
		// 		"lyric-update",
		// 		{
		// 			songInfo: this.songInfo,
		// 			settings: this.settings
		// 		},
		// 		"obs-lyric"
		// 	);
		// },
		copy(text) {
			this.s_system.copyText(text);
		},
		addSong(danmakus) {
			const time = Date.now();
			this.cooling = this.cooling.filter(
				i => time - i.time < 1000 * 60 * this.settings.coolingTime
			);
			danmakus.forEach(danmaku => {
				const uid = this.s_danmakuGetters.getUID(danmaku);
				if (this.cooling.find(i => i.userID === uid)) {
					return;
				}

				const content = this.s_danmakuGetters.getContent(danmaku);
				const nickname = this.s_danmakuGetters.getNickName(danmaku);
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
		loadSettings() {
			this.s_loadSettings().then(res => {
				if (res) {
					Object.assign(this.settings, res);
				}
			});

			this.upgradeSettings();
		},
		upgradeSettings() {
			document.body.style.setProperty(
				"--opacity",
				this.settings.opacity / 100
			);
		},
		saveSettings() {
			this.s_saveSettings(this.settings);
		}
	}
};
</script>
<style>
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
}
.settings > * {
	margin-bottom: 16px;
}
.song-row {
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 8px;
	align-items: center;
}
.song-row > * {
	flex-shrink: 0;
}
.song-row .btn {
	padding: 0px 4px !important;
}
.song-name {
	flex-grow: 1;
	flex-shrink: 1 !important;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
}
.song-name > div {
	margin-right: 8px;
	width: calc(50% - 8px);
}

.rowframe {
	box-sizing: border-box;
	width: 100% !important;
	height: calc(100% / 3 - 16px);
	padding: 4px;
	flex-shrink: 0;
}

.rowframe .list {
	height: calc(100% - 24px);
	width: 100%;
	position: relative;
	overflow-y: auto;
	padding-right: 4px;
	box-sizing: border-box;
	overflow-y: scroll;
}

.rowframe .list:hover {
	padding-right: 0px;
}
.rowframe .list::-webkit-scrollbar {
	-webkit-appearance: none;
	width: 4px;
	border-radius: 5px;
	height: 10px;
	transition: background-color 1s;
	display: none;
}
.rowframe .list:hover::-webkit-scrollbar {
	display: block;
}
.rowframe .list::-webkit-scrollbar-thumb {
	border-radius: 4px;
	background-color: rgba(0, 0, 0, 0.3);
}
.rowframe .list::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.4);
}
.rowframe .list::-webkit-scrollbar-thumb:window-inactive {
	background-color: rgba(0, 0, 0, 0.3);
}
</style>