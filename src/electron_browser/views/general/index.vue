<template>
	<content-frame id="general" align="row">
		<row-frame style="width:100%" title="推流工具路径" flex>
			<row-span :span="4">
				同步启动推流工具
			</row-span>
			<row-span :span="2">
				<el-switch v-model="general.streamToolEnable" @change="save" />
			</row-span>
			<row-span :span="6" v-if="general.streamToolEnable">
				<el-input size="mini" :model-value="general.streamToolPath">
					<template #append>
						<el-button type="primary" size="mini" class="attach" @click="loadStreamToolPath">点击选择
						</el-button>
					</template>
				</el-input>

			</row-span>
			<row-span :span="12"><span class="hint">设置后工具箱启动时会同步打开推流工具(OBS或是直播助手</span></row-span>
		</row-frame>
		<row-frame style="width:100%" title="配置备份/还原" flex>
			<row-span :span="2">
				<el-button size="mini" type="primary" @click="backup">配置备份</el-button>
			</row-span>
			<row-span :span="2">
				<el-button size="mini" type="primary" @click="restore">配置还原</el-button>
			</row-span>
			<row-span :span="12"><span class="hint">一般情况下不需要备份配置，除非重装系统</span></row-span>
		</row-frame>
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { generalSettings } from "@front/datas/danmaku";
import { mapState } from "vuex";
import { load } from "@front/util_function/file";
import {
	saveConfig,
	restoreConfig,
	backupConfig
} from "@front/util_function/system";
import cloneDeep from "lodash/cloneDeep";
import { ElMessage } from "element-plus";
import { danmaku } from "@front/datas";
import { assign } from "@front/util_function/base";
export default defineComponent({
	name: "general",
	data() {
		return {
			general: {
				streamToolEnable: false,
				streamToolPath: ""
			}
		};
	},
	mounted() {
		this.loadConfig();
	},
	computed: {
		...mapState(["danmakuProfile"])
	},
	methods: {
		loadConfig() {
			this.general =
				cloneDeep(this.danmakuProfile.general) || generalSettings();
		},
		loadStreamToolPath() {
			load(".exe").then((res: any) => {
				this.general.streamToolPath = res.path;
				this.save();
			});
		},
		save() {
			Object.assign(this.danmakuProfile, {
				general: cloneDeep(this.general)
			});
			saveConfig(this.danmakuProfile);
			ElMessage({
				duration: 1500,
				message: "保存成功",
				offset: 60,
				type: "success"
			});
		},
		async restore() {
			const file: any = await load(".zip");
			const config = await restoreConfig(file.path);
			if (config) {
				this.$store.state.danmakuProfile = assign(
					danmaku.profile(),
					config
				);
				this.loadConfig();
				this.$store.commit("updateSettings", {});
				ElMessage({
					type: "success",
					message: "配置还原成功！",
					duration: 1500,
					offset: 60
				});
			} else {
				ElMessage({
					type: "error",
					message: "配置还原失败",
					duration: 1500,
					offset: 60
				});
			}
		},
		backup() {
			backupConfig()
				.then((url: any) => {
					window.open(url);
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
#general {
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>
