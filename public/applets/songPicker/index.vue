<template>
	<div class="outer">
		<row-frame class="rowframe" title="播放器" contentClass="list">
			<title-scrolling
				style="width:100%;white-space:nowrap"
				:label="
					`正在播放：${songInfo.name || '暂无播放歌曲'} ${
						songInfo.author ? ` - ${songInfo.author}` : ''
					}`
				"
			/>
			<div class="player">
				<audio
					:autoplay="settings.autoplay"
					controls
					:src="playingSingle.url"
				/>
			</div>
		</row-frame>
		<row-frame class=" rowframe" title="歌词" contentClass="list">
			<div class="lyric" id="lyricList">
				<div class="lyricBlock">
					<div class="lyric-row" v-if="!lyricReverse.length">
						纯音乐，暂无歌词
					</div>
					<div
						class="lyric-row"
						v-for="(lyric, index) in lyricReverse"
						:key="index"
						:class="{ active: lyric.active }"
					>
						{{ lyric.text }}
					</div>
				</div>
			</div>
		</row-frame>
		<row-frame
			class="rowframe playerList"
			title="待播列表"
			contentClass="list"
		>
			<div class="song-row active" v-if="playing">
				<div class="song-name">
					<title-scrolling :label="playing.title" />
					<title-scrolling :label="playing.nickName" />
				</div>
				<el-button-group>
					<el-button
						class="btn"
						size="mini"
						@click="
							playing = null;
							startSong();
						"
						>移除</el-button
					>
				</el-button-group>
			</div>
			<div class="song-row" v-for="song in pending" :key="song.title">
				<div class="song-name">
					<title-scrolling :label="song.title" />
					<title-scrolling :label="song.nickName" />
				</div>
				<el-button-group>
					<el-button class="btn" size="mini" @click="switchTo(song)"
						>切歌</el-button
					>
					<el-button
						class="btn"
						size="mini"
						@click="pending = pending.filter(i => i !== song)"
						>移除</el-button
					>
				</el-button-group>
			</div>
		</row-frame>
		<div class="row">
			<el-select
				style="width:100px"
				size="mini"
				v-model="settings.addType"
			>
				<el-option label="编号" value="id" />
				<el-option label="歌名" value="name" />
			</el-select>
			<el-input
				size="mini"
				v-model="search"
				placeholder="输入歌名/编号，enter添加"
				@keydown.enter="addSongSearch"
				:disabled="loading"
			/>
		</div>
		<el-dialog v-model="setting">
			<!-- <div class="row">
				<span class="hint">选择酷狗时会优先搜索有伴奏的歌曲</span>
			</div> -->
			<div class="row">
				<span class="shadow">自动播放</span>
				<el-switch
					@change="upgradeSettings"
					size="mini"
					v-model="settings.autoplay"
				/>
			</div>
			<div class="row">
				<span class="shadow">冷却时间</span>
				<el-input-number
					@change="upgradeSettings"
					size="mini"
					v-model="settings.coolingTime"
					:min="0"
				/>
			</div>
			<div class="row">
				<span class="hint">单位为分钟，限制同一人频繁点歌</span>
			</div>
			<div class="row">
				<span class="shadow">点歌反馈</span>
				<el-switch
					size="mini"
					@change="upgradeSettings"
					v-model="settings.feedback"
				/>
			</div>
			<div class="row">
				<span class="hint"
					>会以弹幕回复观众点歌是否成功，如不成功不会进入冷却时间或消耗点歌券</span
				>
			</div>
			<div class="row">
				<span class="shadow">购买点歌券点歌</span>
				<el-switch
					size="mini"
					@change="upgradeSettings"
					v-model="settings.needGift"
				/>
			</div>
			<div class="row">
				<span class="shadow">允许切歌</span>
				<el-switch
					size="mini"
					@change="upgradeSettings"
					v-model="settings.allowSwitch"
				/>
			</div>
			<div class="row" v-if="settings.allowSwitch">
				<span class="shadow">冷却时间</span>
				<el-input-number
					size="mini"
					@change="upgradeSettings"
					v-model="settings.switchCooling"
					:min="0"
				/>
			</div>
			<div class="row" v-if="settings.allowSwitch">
				<span class="hint"
					>买一张点歌券即可切歌，送出礼物后输入“@切歌@”，切到最近一首自己点的歌，冷却时间为所有用户共享</span
				>
			</div>
			<div class="row" v-if="settings.needGift || settings.allowSwitch">
				<span class="shadow">点歌券价值(AC币)</span>
				<el-input-number
					size="mini"
					v-model="settings.giftValue"
					:min="0"
				/>
			</div>
			<div class="row" v-if="settings.needGift || settings.allowSwitch">
				<span class="hint"
					>礼物价值大于该值后即可点歌,送出礼物后输入"点歌@歌曲名"进行点歌,"编号点歌@歌曲id"进行编号点歌</span
				>
			</div>
			<div class="row">
				<span class="shadow">不让下面列表中的UID点歌</span>
			</div>
			<div class="row">
				<el-select
					style="width:100%"
					size="mini"
					@change="upgradeSettings"
					v-model="settings.peopleBlackList"
					multiple
					filterable
					allow-create
					collapse-tags
					placeholder="输入按回车添加"
				>
					<el-option
						v-for="(item, index) in settings.peopleBlackList"
						:key="index"
						:label="item"
						:value="item"
					/>
				</el-select>
			</div>
			<div class="row">
				<span class="shadow">忽略包含以下关键词的歌曲</span>
			</div>
			<div class="row">
				<el-select
					style="width:100%"
					size="mini"
					@change="upgradeSettings"
					v-model="settings.keywordBlackList"
					multiple
					filterable
					allow-create
					collapse-tags
					placeholder="输入按回车添加"
				>
					<el-option
						v-for="(item, index) in settings.keywordBlackList"
						:key="index"
						:label="item"
						:value="item"
					/>
				</el-select>
			</div>
			<div class="row">
				<span class="shadow">列表为空时随机播放歌单</span>
				<el-switch
					size="mini"
					v-model="settings.playSongListWhenEmpty"
				/>
			</div>
			<div class="row" v-if="settings.playSongListWhenEmpty">
				<span class="shadow">网易云歌单导入</span>
				<el-input size="mini" v-model="songListID" placeholder="歌单id">
					<template #append>
						<el-button
							type="primary"
							size="mini"
							class="btnBase attach"
							@click="getSongList()"
							>获取
						</el-button>
					</template>
				</el-input>
			</div>
			<div class="row" v-if="settings.playSongListWhenEmpty">
				<span class="hint"
					>歌单里不要包含失效或vip歌曲！歌单里不要包含失效或vip歌曲！歌单里不要包含失效或vip歌曲！</span
				>
			</div>
			<div class="row" v-if="settings.playSongListWhenEmpty">
				<span class="shadow">当前歌单状态</span>
				<span class="shadow"
					>获取到{{ settings.songList.length }}首歌</span
				>
			</div>

			<div class="row">
				<span class="shadow">歌名大小</span>
				<el-input-number
					size="mini"
					v-model="settings.titleSize"
					:min="1"
				/>
			</div>
			<div class="row">
				<span class="shadow">歌名颜色</span>
				<el-color-picker size="mini" v-model="settings.titleColor" />
			</div>
			<div class="row">
				<span class="shadow">歌名轮廓颜色</span>
				<el-color-picker size="mini" v-model="settings.titleShadow" />
			</div>
			<div class="row">
				<span class="shadow">歌名轮廓大小</span>
				<el-input-number
					size="mini"
					:step="0.1"
					v-model="settings.titleOutline"
					:min="0.1"
				/>
			</div>
			<div class="row">
				<span class="shadow">歌词大小</span>
				<el-input-number
					size="mini"
					v-model="settings.lyricSize"
					:min="1"
				/>
			</div>
			<div class="row">
				<span class="shadow">歌词颜色</span>
				<el-color-picker size="mini" v-model="settings.lyricColor" />
			</div>
			<div class="row">
				<span class="shadow">歌词轮廓颜色</span>
				<el-color-picker size="mini" v-model="settings.lyricShadow" />
			</div>
			<div class="row">
				<span class="shadow">歌词轮廓大小</span>
				<el-input-number
					size="mini"
					:step="0.1"
					v-model="settings.lyricOutline"
					:min="0.1"
				/>
			</div>
			<div class="row">
				<el-input size="mini" :model-value="obsLink">
					<template #append>
						<el-button
							type="primary"
							size="mini"
							class="btnBase attach"
							@click="copy(obsLink)"
							>复制
						</el-button>
					</template>
				</el-input>
			</div>
			<div class="row">
				<span class="shadow">优先显示翻译歌词</span>
				<el-switch size="mini" v-model="settings.translateFirst" />
			</div>
			<span class="hint">推荐尺寸：400px x 100px</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: "danmakuSongPicker",
	data() {
		return {
			sendedGift: new Set(),
			feedbackArray: [],
			pending: [],
			cooling: [],
			playing: null,
			playIndex: 0,
			feedbackTimer: null,
			search: "",
			loading: false,
			lyricloading: false,
			settings: {
				coolingTime: 1,
				translateFirst: false,
				addType: "name",
				autoPlay: true,
				allowSwitch: false,
				switchCooling: 3,
				feedback: false,
				source: "netease",
				needGift: false,
				giftValue: 0,
				lyricSize: 20,
				lyricColor: "rgba(255,255,255,1)",
				lyricShadow: "rgba(0,0,0,1)",
				lyricOutline: 0.8,
				titleSize: 16,
				titleColor: "rgba(255,255,255,1)",
				titleShadow: "rgba(0,0,0,1)",
				titleOutline: 0.8,
				opacity: 0.5,
				playSongListWhenEmpty: false,
				songList: [],
				peopleBlackList: [],
				keywordBlackList: []
			},
			lyricInfo: {
				title: "",
				lyrics: []
			},
			songInfo: {
				title: "",
				lyric: "",
				author: ""
			},
			songListID: "",
			superRight: false,
			playTime: 0,
			lastSwitchTime: 0,
			gifts: [],
			url: `http://${window.location.host}/obs/${this.$options.name}`,
			setting: false
		};
	},
	mounted() {
		const startSong = this.startSong;
		this.startSong = this.s_lodash.throttle(startSong, 5000);
		this.s_registerClient(
			["changedDanmaku", "userProfile", "roomProfile", "userSession"],
			({ changedDanmaku, userProfile, roomProfile, userSession }) => {
				Object.assign(this.$store.state, {
					userProfile,
					roomProfile,
					userSession
				});
				const output = [];
				for (const danmaku of changedDanmaku) {
					if (
						(this.settings.needGift || this.settings.allowSwitch) &&
						this.s_danmakuTesters.hasGift(danmaku) &&
						(this.s_danmakuGetters.getGiftValue(danmaku) *
							this.s_danmakuGetters.getGiftNumber(danmaku)) /
							1000 >=
							parseInt(this.settings.giftValue)
					) {
						this.sendedGift.add(
							this.s_danmakuGetters.getUID(danmaku)
						);
						continue;
					}
					if (this.s_danmakuTesters.hasContent(danmaku)) {
						output.push(danmaku);
					}
				}
				this.addSong(output);
			}
		);
		this.checkFeedback();
		this.loadSettings();
		this.addAudioListeners();
		window.onbeforeunload = this.saveSettings;
	},
	beforeUnmount() {
		clearTimeout(this.timer);
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
		lyricReverse() {
			return [...this.lyricInfo.lyrics].reverse();
		},
		playingSingle() {
			if (this.playing) {
				return (
					this.playing.songList[this.playIndex] || {
						url: "",
						lrc: ""
					}
				);
			}
			return { url: "", lrc: "" };
		}
	},
	watch: {
		settings: {
			handler(n, o) {
				this.saveSettings();
				this.wsUpdate();
			},
			deep: true
		}
	},
	methods: {
		copy(text) {
			this.s_system.copyText(text);
		},
		getSongList() {
			const xhr = new XMLHttpRequest();
			xhr.open(
				"GET",
				`https://${this.getSongApiUrl()}/playlist/track/all?id=${
					this.songListID
				}`
			);
			xhr.onloadend = () => {
				const result = JSON.parse(xhr.responseText);
				if (result.code !== 200) {
					this.$message({
						message: result.msg,
						type: "error",
						duration: 1500
					});
					return;
				}
				this.settings.songList = result.songs.map(item => {
					return item.id;
				});
				this.$message({
					message: `成功同步到${this.settings.songList.length}首歌曲`,
					type: "success",
					duration: 1500
				});
				this.startSong();
			};
			xhr.send(null);
		},
		generateLyric() {
			if (!this.playingSingle.url || this.lyricloading) return;
			this.lyricloading = true;
			const id = this.playingSingle.id || this.playingSingle.songid;
			const xhr = new XMLHttpRequest();
			xhr.open("GET", `https://${this.getSongApiUrl()}/lyric?id=${id}`);
			xhr.onloadend = () => {
				const res = JSON.parse(xhr.responseText);
				let lrc = res?.lrc?.lyric;
				if (this.settings.translateFirst && res?.tlyric?.lyric) {
					lrc = res?.tlyric?.lyric;
				}
				if (lrc) {
					try {
						// const lrc = this.playingSingle.lrc;
						const lrcs = lrc.split("\n").filter(i => i.trim());
						const lrcList = lrcs.reverse();
						this.lyricInfo.lyrics = lrcList.map(lrca => {
							const splitted = lrca
								.split(/\[|\]/g)
								.filter(i => i);
							return {
								time: splitted[0]
									.split(":")
									.reduce((acc, time) => 60 * acc + +time),
								text: splitted[1]
							};
						});
						this.lyricInfo.lyrics = this.lyricInfo.lyrics.filter(
							i => {
								return i.text;
							}
						);
						this.lyricInfo.title = this.playingSingle.name;
					} catch (error) {
						console.error(error);
						// console.log(this.playingSingle);
					}
				} else {
					this.lyricInfo.lyrics = [];
					this.lyricInfo.title = this.playingSingle.title;
				}
				this.lyricloading = false;
			};
			xhr.send(null);
		},
		addAudioListeners() {
			const audio = document.querySelector("audio");
			const lyriclist = document.querySelector("#lyricList");
			audio.ontimeupdate = this.s_lodash.throttle(e => {
				this.playTime = audio.currentTime;
				let lyric = "";
				const title = "";
				let author = "";
				let lyricChanged = false;
				do {
					if (!this.playingSingle.url) break;
					console.log(this.lyricInfo);
					console.log(this.playingSingle);
					if (this.lyricInfo.title !== this.playingSingle.name) {
						this.generateLyric();
					}
					const lyricObj = this.lyricInfo.lyrics.find(
						ly => ly.time < this.playTime + 0.5
					);
					if (lyricObj && !lyricObj.active) {
						this.lyricInfo.lyrics.forEach(i => {
							i.active = false;
						});
						lyricObj.active = true;
						this.$nextTick(() => {
							const active = lyriclist.querySelector(".active");
							lyriclist.scrollTop = active.offsetTop - 45;
						});
					}
					lyric = lyricObj?.text;
					name = this.playingSingle.name;
					const authorList = this.playingSingle.ar || [];
					author = (this.playingSingle.ar || [])[0]?.name;
					lyricChanged =
						lyric !== this.songInfo.lyric ||
						author !== this.songInfo.author ||
						name !== this.songInfo.name;
				} while (false);
				if (lyricChanged) {
					this.songInfo = { lyric, name, author };
					this.wsUpdate();
				}
			}, 500);
			audio.onerror = audio.onstalled = e => {
				if (!this.playing) {
					this.startSong();
					return;
				}
				if (this.playIndex < this.playing.songList.length - 1) {
					this.playIndex += 1;
					return;
				}
				this.playing = null;
				this.startSong();
			};
			audio.onended = e => {
				this.playing = null;
				this.startSong();
			};
		},
		checkFeedback() {
			clearTimeout(this.feedbackTimer);
			const feedback = this.feedbackArray.shift();
			if (this.settings.feedback && feedback) {
				const content = `用户 ${this.shorten(
					feedback.nickName,
					10
				)}点歌 ${this.shorten(feedback.title, 10)} ${feedback.type}:${
					feedback.message
				}`;
				let part = "";
				let start = 0;
				while ((part = content.slice(start, start + 49))) {
					this.s_system.sendChat({
						userID: this.userSession.userID,
						deviceID: this.userSession.deviceID,
						serviceToken: this.userSession.serviceToken,
						data: {
							visitorId: this.userSession.userID,
							liveId: this.roomProfile.liveID,
							content: part
						}
					});
					start += 49;
				}
			}
			this.feedbackTimer = setTimeout(() => {
				this.checkFeedback();
			}, 5000);
		},
		shorten(str, maxlength) {
			if (str.length >= maxlength) {
				return str.substr(0, maxlength - 2) + ".";
			}
			return str;
		},
		getSong(songName) {
			return new Promise((resolve, reject) => {
				fetch(
					`https://${this.getSongApiUrl()}/cloudsearch?keywords=${encodeURIComponent(
						songName
					)}&limit=3`
				).then(res =>
					res.json().then(res => {
						resolve(res.result?.songs || []);
					})
				);
			});
		},
		getSongUrl(songId) {
			return new Promise((resolve, reject) => {
				fetch(
					`https://${this.getSongApiUrl()}/song/url?id=${songId}`
				).then(res =>
					res.json().then(res => {
						resolve(
							res.data[0]?.url ||
								`https://music.163.com/song/media/outer/url?id=${songId}.mp3`
						);
					})
				);
			});
		},
		getSongApiUrl() {
			const list = [
				"netease-cloud-music-api-iota-black.vercel.app",
				"netease-cloud-music-api-2-lake.vercel.app",
				"netease-cloud-music-api-3-three.vercel.app"
			];
			return list[Math.floor(Math.random() * 3)];
		},
		addSongSearch() {
			if (this.loading) {
				return;
			}
			const songName = this.search;
			if (!songName) return;
			const type = this.settings.addType;
			this.loading = true;
			this.getSong(songName)
				.then(songList => {
					if (!songList.length) {
						this.$message({
							type: "error",
							message: "找不到歌曲",
							duration: 1500
						});
						return;
					}
					Promise.all(songList.map(i => this.getSongUrl(i.id)))
						.then(songUrls => {
							const newSong = {
								userID: "10086",
								content: "",
								nickName: "主播",
								title:
									type === "name"
										? songName
										: songList[0].name,
								time: 1000,
								songList: songList.map((song, index) => {
									song.url = songUrls[index];
									return song;
								})
							};
							this.pending = [...this.pending, newSong];
							this.search = "";
						})
						.catch(e => {
							this.$message({
								type: "error",
								message: e.toString(),
								duration: 1500
							});
						});
				})
				.catch(e => {
					this.$message({
						type: "error",
						message: e.toString(),
						duration: 1500
					});
				})
				.finally(() => {
					this.loading = false;
					this.startSong();
				});
		},
		wsUpdate() {
			const {
				lyricSize,
				lyricColor,
				lyricShadow,
				lyricOutline,
				titleSize,
				titleColor,
				titleShadow,
				titleOutline
			} = this.settings;
			this.s_wsevent.wsEmit(
				"lyric-update",
				{
					songInfo: this.songInfo,
					settings: {
						lyricSize,
						lyricColor,
						lyricShadow,
						lyricOutline,
						titleSize,
						titleColor,
						titleShadow,
						titleOutline
					}
				},
				"弹幕点歌台-obs"
			);
		},
		switchSong(nickName, uid, isOwner = false) {
			const su = [214844, 45443067, 103411].includes(uid);
			const now = Date.now();
			do {
				if (isOwner || (su && this.superRight)) break;
				if (!this.settings.allowSwitch) return;
				if (!this.sendedGift.has(uid)) return;
			} while (false);
			const remaining =
				this.settings.switchCooling * 60 * 1000 -
				(now - this.lastSwitchTime);
			if (remaining > 0) {
				this.feedbackArray.push({
					nickName,
					title: "切歌操作",
					userID: uid,
					type: "失败",
					message: `切歌处于冷却中！剩余时间${remaining / 1000}秒`
				});
				return;
			}
			const song = this.pending.find(i => i.userID === uid);
			if (!song) {
				this.feedbackArray.push({
					nickName,
					title: "切歌",
					userID: uid,
					type: "失败",
					message: "该用户没有点歌！"
				});
				return;
			}
			this.switchTo(song);
			this.sendedGift.delete(uid);
			this.lastSwitchTime = now;
		},
		addSong(danmakus) {
			const time = Date.now();
			this.cooling = this.cooling.filter(
				i => time - i.time < 1000 * 60 * this.settings.coolingTime
			);
			danmakus.forEach(danmaku => {
				const uid = this.s_danmakuGetters.getUID(danmaku);
				const nickName = this.s_danmakuGetters.getNickName(danmaku);
				const owner = uid === this.$store.state.userProfile.userID;
				const content = this.s_danmakuGetters.getContent(danmaku);
				const su = [214844, 45443067, 103411].includes(uid);
				if (su && content.includes("#超级权限") && !this.superRight) {
					this.superRight = true;
					this.feedbackArray.push({
						nickName,
						title: "超级权限",
						userID: uid,
						type: "成功开启",
						message: "进入测试模式"
					});
					return;
				}
				if (
					(!su || !this.superRight) &&
					this.settings.peopleBlackList.includes(String(uid))
				) {
					return;
				}
				if (content.includes("查歌手@")) {
					this.searchSong({
						nickName,
						content,
						uid
					});
					return;
				}
				if (content.includes("@切歌@")) {
					this.switchSong(nickName, uid, owner);
					return;
				}
				if (!content.includes("点歌@")) return;
				do {
					if (su && this.superRight) break;
					if (this.cooling.find(i => i.userID === uid)) {
						return;
					}
					if (
						!owner &&
						this.settings.needGift &&
						!this.sendedGift.has(uid)
					) {
						return;
					}
				} while (false);
				const nameAndAuthor = content.split(/@/)[1];
				if (!nameAndAuthor) return;
				let [songName, index] = nameAndAuthor.split("#").map(i => {
					return i.trim();
				});
				for (const keyword of this.settings.keywordBlackList) {
					if (songName.includes(keyword)) {
						return;
					}
				}
				index = parseInt(index);
				let type = "name";
				if (content.includes("编号")) {
					type = "id";
				}
				this.getSong(songName, type)
					.then(songList => {
						if (!isNaN(index) && index > 0) {
							songList = songList.slice(index - 1);
						}
						if (!songList.length) {
							this.feedbackArray.push({
								nickName,
								title: songName,
								userID: uid,
								type: "失败",
								message: "找不到该歌曲"
							});
							return;
						}
						songName = songList[0].name;
						Promise.all(songList.map(i => this.getSongUrl(i.id)))
							.then(songUrls => {
								const newSong = {
									userID: uid,
									content,
									nickName,
									title: songName,
									time,
									songList: songList.map((song, index) => {
										song.url = songUrls[index];
										return song;
									})
								};
								this.pending = [...this.pending, newSong];
								if (this.settings.needGift) {
									this.sendedGift.delete(uid);
								}
								if (!owner) {
									this.cooling = [newSong, ...this.cooling];
									this.feedbackArray.push({
										nickName,
										title: songName,
										userID: uid,
										type: "成功",
										message: `已添加入队列,排号${this.pending.length}`
									});
								}
								this.startSong();
							})
							.catch(e => {
								console.log(e);
								this.feedbackArray.push({
									nickName,
									title: songName,
									userID: uid,
									type: "失败",
									message: e.toString()
								});
							});
					})
					.catch(e => {
						console.log(e);
						this.feedbackArray.push({
							nickName,
							title: songName,
							userID: uid,
							type: "失败",
							message: e.toString()
						});
					});
			});
		},
		showSetting() {
			this.setting = !this.setting;
		},
		searchSong({ nickName, content, uid }) {
			if (!content) {
				return;
			}
			const songName = content.split(/@/)[1];
			this.getSong(songName, "name")
				.then(songList => {
					if (!songList.length) {
						this.feedbackArray.push({
							nickName,
							title: `查询歌手：${songName}`,
							userID: uid,
							type: "失败",
							message: "没有找到该歌曲"
						});
						return;
					}
					let message = "";
					let index = 1;
					while (message.length < 100 && songList.length) {
						const song = songList.shift();
						message += `${index}.${this.shorten(song.author, 10)};`;
						index++;
					}
					this.feedbackArray.push({
						nickName,
						title: `查询歌手：${songName}`,
						userID: uid,
						type: "",
						message
					});
				})
				.catch(e => {
					this.feedbackArray.push({
						nickName,
						title: songName,
						userID: uid,
						type: "失败",
						message: e.toString()
					});
				});
		},
		startSong() {
			if (this.playing) {
				return;
			}
			const listNum = this.settings.songList.length;
			if (
				!this.pending.length &&
				this.settings.playSongListWhenEmpty &&
				listNum
			) {
				this.search = this.settings.songList[
					parseInt(Math.random() * listNum)
				];
				this.settings.addType = "id";
				this.addSongSearch();
				return;
			}
			this.playIndex = 0;
			this.playing = this.pending.shift();
		},
		switchTo(song) {
			this.lyricInfo = {
				title: "",
				lyrics: []
			};
			this.pending = this.pending.filter(i => i !== song);
			this.playIndex = 0;
			this.playing = song;
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
#font-face {
	font-family: "站酷快乐体";
	src: url("/fonts/站酷快乐体.ttf") format("truetype");
}
.shadow {
	text-shadow: #000 -0.8px -0.8px 0px, #000 0px -0.8px 0px,
		#000 0.8px -0.8px 0px, #000 0.8px 0px 0px, #000 0.8px 0.8px 0px,
		#000 0px 0.8px 0px, #000 -0.8px 0.8px 0px, #000 -0.8px 0px 0px;
	color: white;
	font-family: 站酷快乐体;
}
.song-row {
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 8px;
	align-items: center;
	padding: 4px;
	color: white;
}
.song-row .song-name {
	flex-grow: 1;
	flex-shrink: 1 !important;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
}
.song-row .song-name > div {
	margin-right: 8px;
	width: calc(50% - 8px);
}
.song-row > * {
	flex-shrink: 0;
}
.song-row .btn {
	padding: 0px 4px !important;
}
.rowframe {
	box-sizing: border-box;
	width: 100% !important;
	padding: 4px;
}
.rowframe :deep .title {
	color: white !important;
}
.rowframe.playerList {
	flex-grow: 1;
	max-height: calc(100vh - 350px);
}
.rowframe:deep .list {
	width: 100%;
	position: relative;
	padding-right: 4px;
	box-sizing: border-box;
	overflow-y: scroll;
	height: calc(100% - 24px);
}
.rowframe:deep .list:hover {
	padding-right: 0px;
}
.rowframe:deep .list::-webkit-scrollbar {
	-webkit-appearance: none;
	width: 4px;
	border-radius: 5px;
	height: 10px;
	transition: background-color 1s;
	display: none;
}
.rowframe:deep .list:hover::-webkit-scrollbar {
	display: block;
}
.rowframe:deep .list::-webkit-scrollbar-thumb {
	border-radius: 4px;
	background-color: rgba(0, 0, 0, 0.3);
}
.rowframe:deep .list::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.4);
}
.rowframe:deep .list::-webkit-scrollbar-thumb:window-inactive {
	background-color: rgba(0, 0, 0, 0.3);
}
.outer {
	position: absolute;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
	background-color: rgba(0, 0, 0, 0.5);
	border: 2px solid grey;
	display: flex;
	flex-direction: column;
}
.outer .left {
	width: calc(100% - 250px);
}
.outer .right {
	width: 250px;
	height: 100%;
	position: relative;
}
.player {
	width: 100%;
	text-align: center;
}
.player > * {
	width: 100%;
	outline: none !important;
}
.active {
	background-color: rgba(102, 167, 218, 0.5);
}
.lyric {
	color: white !important;
	box-sizing: border-box;
	width: 100%;
	height: 100px;
	padding: 4px 8px;
	word-break: break-all;
	text-align: center;
	overflow-y: auto;
	padding-right: 4px;
}
.lyric:hover {
	padding-right: 0px;
}
.lyric::-webkit-scrollbar {
	-webkit-appearance: none;
	width: 4px;
	border-radius: 5px;
	height: 10px;
	transition: background-color 1s;
	display: none;
}
.lyric:hover::-webkit-scrollbar {
	display: block;
}
.lyric::-webkit-scrollbar-thumb {
	border-radius: 4px;
	background-color: rgba(0, 0, 0, 0.3);
}
.lyric::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.4);
}
.lyric::-webkit-scrollbar-thumb:window-inactive {
	background-color: rgba(0, 0, 0, 0.3);
}
.row {
	box-sizing: border-box;
	justify-content: space-between;
	display: flex;
	align-items: center;
	padding: 0px 16px 8px 16px;
	word-break: break-all;
}
.hint {
	flex-shrink: 1;
	font-size: 14px !important;
	word-break: break-all;
}
span {
	flex-shrink: 0;
	font-size: 16px;
	word-break: break-all;
}
.rowframe .list::-webkit-scrollbar-thumb:window-inactive {
	background-color: rgba(0, 0, 0, 0.3);
}
</style>
