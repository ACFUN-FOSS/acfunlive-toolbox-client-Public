<template>
	<content-frame
		id="roomMgmt"
		v-loading="loading"
		element-loading-text="推流时间从10秒到30秒不等，请耐心等待"
	>
		<row-frame title="封面选择">
			<row-span>
				<img-input-clip v-model="roomProfile.liveCover" />
				<div class="hint">（仅支持jpg、png格式，推荐比例16:10）</div>
			</row-span>
		</row-frame>
		<row-frame :flex="true">
			<row-span :span="6">
				<row-frame
					title="房间标题"
					style="width:100%;margin-bottom:0px"
				>
					<el-input
						size="mini"
						placeholder="请输入房间名称"
						v-model="roomProfile.title"
					/>
				</row-frame>
			</row-span>
			<row-span :span="6">
				<row-frame
					title="允许观众剪辑"
					style="width:100%;margin-bottom:0px"
				>
					<el-switch v-model="canCut" @click="setCanCut" />
				</row-frame>
			</row-span>
		</row-frame>

		<row-frame :flex="true">
			<row-span :span="8">
				<row-frame
					title="直播分区"
					:flex="true"
					style="width:100%;margin-bottom:0px"
				>
					<el-cascader
						size="mini"
						style="width:100%"
						placeholder="请选择分区"
						v-model="categoryValue"
						:options="categoryCascade"
					/>
				</row-frame>
			</row-span>
			<row-span :span="4" v-if="isStreaming">
				<row-frame
					title=" "
					style="width:100%;margin-bottom:0px;text-align:right"
				>
					<el-button
						type="primary"
						size="mini"
						class="btnBase"
						@click="setRoomProfile"
						:disabled="changed"
					>
						修改标题封面
					</el-button>
				</row-frame>
			</row-span>
		</row-frame>
		<row-frame title="弹幕流链接" :flex="true">
			<row-span :span="12">
				<el-input size="mini" :model-value="danmakuStream">
					<template #append>
						<el-button
							type="primary"
							size="mini"
							class="btnBase attach"
							@click="copy(danmakuStream)"
							>复制
						</el-button>
					</template>
				</el-input>
				<div class="hint">（将上访链接黏贴到推流软件内置浏览器中）</div>
			</row-span>
		</row-frame>
		<row-frame title="弹幕流链接（官方）" :flex="true">
			<row-span :span="12">
				<el-input size="mini" :model-value="danmakuOfficial">
					<template #append>
						<el-button
							type="primary"
							size="mini"
							class="btnBase attach"
							@click="copy(danmakuOfficial)"
							>复制
						</el-button>
					</template>
				</el-input>
			</row-span>
		</row-frame>
		<row-frame title="OBS同步推流" :flex="true">
			<row-span :span="4">
				<el-checkbox v-model="obsSync">启用</el-checkbox>
			</row-span>
			<row-span
				v-if="obsSync"
				:class="obsOnline ? 'online' : 'offline'"
				:span="4"
			>
				{{ obsOnline ? "OBS已连接" : "OBS未连接" }}
			</row-span>
			<row-span v-if="obsSync" :span="3">
				<el-button
					type="primary"
					size="mini"
					class="btnBase"
					@click="connectOBS()"
					>连接OBS
				</el-button>
			</row-span>
			<div v-if="obsOnline" class="hint">
				（如上方显示OBS未连接，请根据文件夹中的说明检查是否正确配置）
			</div>
			<div v-else class="hint">
				（如需手动推流，请将下方直播地址和直播码配置到推流软件中，待下方推流状态成功后开启直播，acfun直播助手开播后工具箱会自动切换到直播状态）
			</div>
		</row-frame>
		<row-frame v-if="!obsSync" title="RTMP服务器(Server)" :flex="true">
			<row-span :span="12">
				<el-input size="mini" :model-value="streamSession.rtmpServer">
					<template #append>
						<el-button
							type="primary"
							size="mini"
							class="btnBase attach"
							@click="copy(streamSession.rtmpServer)"
							>复制
						</el-button>
					</template>
				</el-input>
			</row-span>
		</row-frame>
		<row-frame
			v-if="!obsSync"
			title="直播码/串流密钥(Stream Key)"
			:flex="true"
		>
			<row-span :span="9.5">
				<el-input size="mini" :model-value="streamSession.streamKey">
					<template #append>
						<el-button
							type="primary"
							size="mini"
							class="btnBase attach"
							@click="copy(streamSession.streamKey)"
							>复制
						</el-button>
					</template>
				</el-input>
			</row-span>
			<row-span :span="2">
				<el-button
					type="primary"
					size="mini"
					@click="$store.commit('getStreamSession')"
					>刷新</el-button
				>
			</row-span>
			<div class="hint">
				（考虑到用户隐私，直播码每次开播都会默认刷新）
			</div>
		</row-frame>
		<row-frame v-if="!obsSync" title="推流状态" :flex="true">
			<row-span
				:class="streamEncodec.resolution ? 'online' : 'offline'"
				:span="4"
			>
				{{ streamEncodec.resolution ? "推流成功" : "推流等待中" }}
			</row-span>
			<row-span :span="2">
				<el-button
					type="primary"
					size="mini"
					@click="$store.commit('getStreamEncodec')"
					>刷新</el-button
				>
			</row-span>
		</row-frame>
		<row-frame title="下播" v-if="isStreaming" :flex="true">
			<row-span :span="4">
				<el-button
					type="primary"
					size="mini"
					class="btnBase"
					@click="closeStream"
					>下播
				</el-button>
			</row-span>
		</row-frame>
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import { ElMessage, ElMessageBox } from "element-plus";
import { room } from "@front/datas";
import { closeStream } from "@front/mixins/methods";
import { event } from "@front/util_function/eventBus";
import { sleep, isUrl } from "@front/util_function/base";
import { copy } from "@front/util_function/clipboard";
import OBSWebSocket from "obs-websocket-js";
import { getCutStatus, setCutStatus } from "@front/api/room";
let OBS: any = null;
export default defineComponent({
	name: "roomMgmt",
	mixins: [closeStream],
	data() {
		const roomProfile: room.ProfileDetail = cloneDeep(
			this.$store.state.roomProfile
		);
		if (roomProfile.liveType.categoryID === 0) {
			roomProfile.liveType.categoryID = 1;
			roomProfile.liveType.subCategoryID = 101;
		}
		const timer: any = null;
		return {
			obsSync: false,
			obsOnline: false,
			loading: false,
			canCut: false,
			count: 0,
			timer,
			roomProfile,
			danmakuStream: `${window.location.origin}/obs/danmaku/`,
			magicScreen: `${window.location.origin}/obs/screen`
		};
	},
	computed: {
		...mapGetters(["categoryCascade", "isStreaming"]),
		...mapState([
			"streamSession",
			"streamEncodec",
			"roomCategorys",
			"userSession"
		]),
		changed(): boolean {
			return (
				this.roomProfile.title ===
					this.$store.state.roomProfile.title &&
				this.roomProfile.liveCover ===
					this.$store.state.roomProfile.liveCover
			);
		},
		danmakuOfficial(): string {
			return `https://live.acfun.cn/room/${this.userSession.userID}?theme=default&showAuthorclubOnly=true&showAvatar=true`;
		},
		categoryValue: {
			get(): Array<number> {
				return [
					this.roomProfile.liveType.categoryID,
					this.roomProfile.liveType.subCategoryID
				];
			},
			set(e: any): void {
				const subCategoryID = e[1];
				const category = this.roomCategorys.find(
					(roomCategory: any) => {
						return roomCategory.subCategoryID === subCategoryID;
					}
				);
				if (category) {
					this.roomProfile.liveType = { ...category };
				}
			}
		}
	},
	mounted() {
		this.connectOBS();
		this.$store.commit("getCategory");
		this.$store.commit("getStreamSession"); // get rtmp key when no streaming
		this.loadCache();
		this.getCutStatus();
		event.on("openStream", this.openStream);
		this.timer = setInterval(() => {
			this.$store.commit("getStreamEncodec");
		}, 3000);
	},
	beforeUnmount() {
		this.saveCache();
		OBS.disconnect();
		event.off("openStream", this.openStream);
		event.emit("openStreamEnd");
		clearInterval(this.timer);
	},
	methods: {
		connectOBS() {
			const clearObs = () => {
				OBS?.disconnect();
				OBS = null;
				this.obsOnline = false;
			};
			clearObs();
			const obs = new OBSWebSocket();
			obs.connect()
				.then(() => {
					OBS = obs;
					this.obsOnline = true;
				})
				.catch(() => {
					this.obsOnline = false;
				});

			obs.on("ConnectionClosed", clearObs);
			obs.on("ConnectionError", clearObs);
		},
		getCutStatus() {
			getCutStatus().then(({ canCut }) => {
				this.canCut = canCut;
			});
		},
		setCanCut() {
			setCutStatus(this.canCut)
				.catch((message: any) => {
					ElMessage({
						type: "error",
						message,
						duration: 1500
					});
				})
				.finally(this.getCutStatus);
		},
		copy,
		saveCache() {
			localStorage.setItem(
				"imgCache",
				JSON.stringify({
					title: this.roomProfile.title,
					img: this.roomProfile.liveCover,
					category: this.roomProfile.liveType,
					obsSync: this.obsSync
				})
			);
		},
		loadCache() {
			let cache: any = localStorage.getItem("imgCache");
			if (!cache) {
				return;
			}
			cache = JSON.parse(cache);
			this.roomProfile.title = cache.title;
			this.roomProfile.liveCover = cache.img;
			this.roomProfile.liveType = cache.category || room.category();
			this.obsSync = cache.obsSync;
		},
		async setRoomProfile() {
			await this.$store.commit("setRoomProfile", {
				liveID: this.$store.state.roomProfile.liveID,
				coverFile: this.generateUrl(this.roomProfile.liveCover),
				title: this.roomProfile.title
			});
			event.once("roomProfileChanged", () => {
				ElMessage({
					message: "修改成功",
					duration: 1500,
					type: "success",
					offset: 60
				});
			});
		},
		async openStream() {
			if (!this.validation()) {
				setTimeout(() => {
					event.emit("openStreamEnd");
				}, 500);
				return;
			}
			if (this.obsSync) {
				const status: any = await OBS.call("GetStreamStatus");
				try {
					if (status?.outputActive) {
						await OBS.call("StopStream");
					}
					await sleep(2000);
					await OBS.call("SetStreamServiceSettings", {
						streamServiceType: "rtmp_custom",
						streamServiceSettings: {
							server: this.streamSession.rtmpServer,
							key: this.streamSession.streamKey,
							bwtest: false,
							use_auth: false
						}
					});
					await OBS.call("StartStream");
					this.readyToStream();
				} catch (error) {
					console.error(error);
					ElMessageBox({
						title: "OBS启播失败",
						confirmButtonText: "淦哦"
					});
				}
				return;
			}
			this.readyToStream();
		},
		generateUrl(str: string) {
			if (isUrl(str)) {
				return str;
			}
			return `${window.location.origin}${str}`;
		},
		async readyToStream() {
			this.loading = true;
			if (!this?.streamEncodec?.resolution) {
				if (this.count < 60) {
					setTimeout(() => {
						this.count++;
						this.readyToStream();
					}, 1000);
					return;
				}
				ElMessage({
					message: "推流未成功，请等待10秒/刷新密匙重新配置后重试",
					duration: 1500,
					type: "error",
					offset: 60
				});
				this.count = 0;
				this.loading = false;
				event.emit("openStreamEnd");
				return;
			}
			this.saveCache();
			this.$store
				.dispatch("openStream", {
					title: this.roomProfile.title,
					coverFile: this.generateUrl(this.roomProfile.liveCover),
					streamName: this.streamSession.streamName,
					portrait: false,
					panoramic: false,
					categoryID: this.roomProfile.liveType.categoryID,
					subCategoryID: this.roomProfile.liveType.subCategoryID
				})
				.catch((e: any) => {
					console.error(e);
					ElMessage({
						message: e,
						duration: 1500,
						type: "error",
						offset: 60
					});
				})
				.finally(() => {
					this.loading = false;
					event.emit("openStreamEnd");
				});
		},
		validation() {
			let errmsg = "";
			if (!this.roomProfile.title) {
				errmsg += "房间标题不为空 ";
			}
			if (
				!this.roomProfile.liveCover ||
				this.roomProfile.liveCover.includes("base64")
			) {
				errmsg += "房间封面无效，请重新上传 ";
			}
			if (this.obsSync && !OBS) {
				errmsg += "OBS未能连接，请刷新OBS状态或确认插件是否安装 ";
			}
			if (errmsg) {
				ElMessage({
					message: "错误: " + errmsg,
					duration: 1500,
					type: "error",
					offset: 60
				});
				return false;
			}
			return true;
		}
	}
});
</script>

<style scoped lang="scss">
@import "@front/styles/variables.scss";
#roomMgmt {
	position: absolute;
	width: 100%;
	height: 100%;
	:deep .imgInput {
		width: 100%;
		padding-bottom: 40%;
		box-shadow: $--box-shadow-base;
	}
	.btnBase {
		background-color: $--color-primary;
		color: white;
		&.attach {
			border-top-left-radius: 0px !important;
			border-bottom-left-radius: 0px !important;
			box-shadow: none !important;
		}
	}
}
</style>
