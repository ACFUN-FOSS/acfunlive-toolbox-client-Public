<template>
	<content-frame id="roomMgmt">
		<row-frame title="封面选择">
			<row-span>
				<img-input-base ref="img" class="imgFile" v-model:src="roomProfile.liveCover" />
				<div class="hint">（仅支持jpg、png格式，推荐比例16:9）</div>
			</row-span>
		</row-frame>
		<row-frame title="房间标题">
			<row-span>
				<el-input size="mini" placeholder="请输入房间名称" v-model="roomProfile.title" />
			</row-span>
		</row-frame>
		<row-frame :flex="true">
			<row-span :span="4">
				<row-frame title="直播分区" :flex="true" style="width:100%;margin-bottom:0px">
					<el-select style="width:100%" size="mini" placeholder="请选择分区" :disabled="false"
						v-model="roomProfile.liveType.categoryID" @change="roomProfile.liveType.subCategoryID = ''">
						<el-option v-for="row in mainCategorys" :label="row.categoryName" :key="row.categoryID"
							:value="row.categoryID" />
					</el-select>
				</row-frame>
			</row-span>
			<row-span :span="4">
				<row-frame title="子分区" :flex="true" style="width:100%;margin-bottom:0px">
					<el-select style="width:100%" size="mini" placeholder="请选择分区" :disabled="false"
						v-model="roomProfile.liveType.subCategoryID">
						<el-option v-for="row in subCategorys(roomProfile.liveType.categoryID)" :label="row.subCategoryName"
							:key="row.subCategoryID" :value="row.subCategoryID" />
					</el-select>
				</row-frame>
			</row-span>
			<row-span :span="4" v-if="$store.state.streamStatus.underway">
				<row-frame title=" " style="width:100%;margin-bottom:0px;text-align:right">
					<el-button size="mini" class="btnBase" @click="setRoomProfile" :disabled="changed">修改标题封面</el-button>
				</row-frame>
			</row-span>
		</row-frame>
		<row-frame title="开播选项" :flex="true">
			<row-span :span="6" style="margin-bottom:8px">
				<el-switch disabled active-text="OBS同步推流" />
			</row-span>
			<row-span :span="6" style="margin-bottom:8px">
				<el-switch disabled active-text="OBS同步录像" />
			</row-span>
			<row-span :span="6" style="margin-bottom:8px">
				<el-switch disabled active-text="群发通知" />
			</row-span>
			<row-span :span="6" style="margin-bottom:8px">
				<el-switch disabled active-text="鸡鸡人" />
			</row-span>

		</row-frame>
		<row-frame title="RTMP服务器(Server)" :flex="true">
			<row-span :span="12">
				<el-input size="mini" :model-value="streamSession.rtmpServer">
					<template #append>
						<el-button size="mini" class="btnBase attach" @click="copy(streamSession.rtmpServer)">复制</el-button>
					</template>
				</el-input>
			</row-span>
		</row-frame>
		<row-frame title="直播码/串流密钥(Stream Key)">
			<div style="width:100%;display:flex" :flex="true">
				<row-span :span="12">
					<el-input size="mini" :model-value="streamSession.streamKey">
						<template #append>
							<el-button size="mini" class="btnBase attach" @click="copy(streamSession.streamKey)">复制</el-button>
						</template>
					</el-input>
				</row-span>
			</div>
			<div class="hint">（考虑到用户隐私，直播码每次开播都会默认刷新，请复制上方直播码，粘贴到推流软件对应位置。）</div>
		</row-frame>
		<row-frame title="弹幕流链接(未完成，无需理会)">
			<div style="width:100%;display:flex" :flex="true">
				<row-span :span="12">
					<el-input size="mini" :model-value="danmakuStream">
						<template #append>
							<el-button size="mini" class="btnBase attach" @click="copy(danmakuStream)">复制</el-button>
						</template>
					</el-input>
				</row-span>
			</div>
		</row-frame>
		<row-frame title="画屏链接(未完成，无需理会)">
			<div style="width:100%;display:flex" :flex="true">
				<row-span :span="12">
					<el-input size="mini" :model-value="magicScreen">
						<template #append>
							<el-button size="mini" class="btnBase attach" @click="copy(magicScreen)">复制</el-button>
						</template>
					</el-input>
				</row-span>
			</div>
			<div class="hint">（请复制上方链接，粘贴到推流软件内置浏览器里。）</div>
		</row-frame>
		<row-frame title="OBS状态">
			<div style="width:100%;display:flex" :flex="true">
				<row-span :class="obsOnline?'online':'offline'" :span="4">
					{{obsOnline?"OBS已连接":"OBS未连接"}}
				</row-span>
				<row-span :span="4">
					<el-button size="mini" class="btnBase" @click="$store.dispatch('checkStreamStatus')">刷新OBS状态
					</el-button>
				</row-span>
				<row-span :span="4" v-if="!$store.state.streamStatus.underway">
					<el-button size="mini" class="btnBase" :disabled="obsOnline" @click="$store.commit('getStreamSession')">刷新密匙
					</el-button>
				</row-span>
				<row-span :span="4" v-else>
					<el-button size="mini" class="btnBase" @click="closeStream">下播
					</el-button>
				</row-span>
			</div>
		</row-frame>
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";
import _ from "lodash";
import { ElMessage } from "element-plus";
import { room } from "@fe/api/ws_h";
import { closeStream } from "@fe/mixins/methods";
export default defineComponent({
	name: "roomMgmt",
	mixins: [closeStream],
	data() {
		const roomProfile: room.profileDetail = _.cloneDeep(
			this.$store.state.roomProfile
		);
		if (roomProfile.liveType.categoryID === 0) {
			roomProfile.liveType.categoryID = 1;
			roomProfile.liveType.subCategoryID = 101;
		}
		return {
			roomProfile,
			danmakuStream: `${window.location.host}/obs/danmaku/?id=${this.$store.state.userSession.userID}`,
			magicScreen: `${window.location.host}/obs/screen`
		};
	},
	computed: {
		...mapGetters(["api", "mainCategorys", "subCategorys"]),
		...mapState(["streamSession", "streamEncodec"]),
		changed(): boolean {
			return (
				this.roomProfile.title ===
					this.$store.state.roomProfile.title &&
				this.roomProfile.liveCover ===
					this.$store.state.roomProfile.liveCover
			);
		},
		obsOnline(): boolean {
			return Boolean(this.streamEncodec.resolution);
		}
	},
	mounted() {
		this.$store.commit("getCategory");
		this.$store.dispatch("checkStreamStatus");
		this.loadImgCache();
		this.$Event.on("openStream", this.openStream);
	},
	beforeUnmount() {
		this.$Event.off("openStream", this.openStream);
	},
	methods: {
		async copy(text: string) {
			await this.$SM.copyText(text);
			ElMessage({
				message: "复制成功",
				duration: 1500,
				type: "success",
				offset: 60
			});
		},
		saveImgCache() {
			const img: any = this.$refs.img;
			if (img.blob && img.blob.path) {
				localStorage.setItem(
					"imgCache",
					JSON.stringify({
						title: this.roomProfile.title,
						img: this.roomProfile.liveCover,
						filePath: img.blob.path
					})
				);
			}
		},
		loadImgCache() {
			const img: any = this.$refs.img;

			let cache: any = localStorage.getItem("imgCache");
			if (!cache) {
				return;
			}
			cache = JSON.parse(cache);
			this.roomProfile.title = cache.title;
			this.roomProfile.liveCover = cache.img;
			img.blob = { path: cache.filePath };
		},
		async setRoomProfile() {
			const img: any = this.$refs.img;
			await this.$store.commit("setRoomProfile", {
				liveID: this.$store.state.roomProfile.liveID,
				coverFile: img.blob && img.blob.path ? img.blob.path : "",
				title: this.roomProfile.title
			});
			this.$Event.once("roomProfileChanged", () => {
				this.$store.dispatch("checkStreamStatus");
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
				return;
			}
			const img: any = this.$refs.img;
			await this.$store.commit("openStream", {
				title: this.roomProfile.title,
				coverFile: img.blob.path,
				streamName: this.streamSession.streamName,
				portrait: false,
				panoramic: false,
				categoryID: this.roomProfile.liveType.categoryID,
				subCategoryID: this.roomProfile.liveType.subCategoryID
			});
			this.saveImgCache();
			this.$Event.once("liveStarted", () => {
				this.$store.dispatch("checkStreamStatus");
				ElMessage({
					message: "直播已开启",
					duration: 1500,
					type: "success",
					offset: 60
				});
				this.$Event.emit("routeChange", {
					name: "statusPanel"
				});
			});
		},
		validation() {
			let errmsg = "";
			if (!this.roomProfile.title) {
				errmsg += "房间标题不为空 ";
			}
			const img: any = this.$refs.img;
			if (!img.blob || !img.blob.path) {
				errmsg += "房间封面不能为空 ";
			}
			if (!this.streamEncodec.resolution) {
				errmsg += "推流未成功！";
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

<style scoped lang='scss'>
@import "@fe/assets/scss/base";
#roomMgmt {
	position: absolute;
	width: 100%;
	height: 100%;
	.imgFile {
		width: 100%;
		padding-bottom: 40%;
		box-shadow: var(--generalStyle_shadow_base);
	}
	.btnBase {
		@include buttonBase(
			var(--generalStyle_color_primary),
			var(--generalStyle_color_primary_EL),
			white
		);
		&.attach {
			border-top-left-radius: 0px !important;
			border-bottom-left-radius: 0px !important;
			box-shadow: none !important;
		}
	}
}
</style>
