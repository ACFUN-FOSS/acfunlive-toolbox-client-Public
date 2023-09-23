<template>
	<content-frame id="superChat" align="row">
		<div class="hint">设置好规则以后，直播过程在主播端和观众端都会将符合规则的礼物及送礼人的最新弹幕置顶显示</div>
		<div class="hint">晋级条件：显示还差多少打赏更换到下一个牌子(开启后到样式编辑器查看效果)</div>
		<row-frame title=" " style="width:100%" :flex="true">
			<row-span :span="1">
				开启
			</row-span>
			<row-span :span="1">
				<el-switch v-model="superChat.enable" />
			</row-span>
			<template v-if="superChat.enable">
				<row-span :span="1.5">
					观众端开启
				</row-span>
				<row-span :span="1">
					<el-switch v-model="superChat.webEnable" />
				</row-span>
				<row-span :span="1.8">
					显示晋级条件
				</row-span>
				<row-span :span="1">
					<el-switch v-model="superChat.showNextLevel" />
				</row-span>
				<row-span :span="1">
					单位
				</row-span>
				<row-span :span="1.7">
					<el-select style="margin-top:-8px" size="mini" v-model="superChat.displayType">
						<el-option v-for="(item,index) in displayType" :key="index" :label="item.label" :value="item.value" />
					</el-select>
				</row-span>
				<row-span style="text-align:right;" :span="1">
					<el-button size="mini" style="margin-top:-8px" type="primary" @click="sort">排序</el-button>
				</row-span>
			</template>
			<row-span style="text-align:right;" :span="1">
				<el-button size="mini" style="margin-top:-8px" type="primary" @click="save">保存</el-button>
			</row-span>
		</row-frame>
		<row-frame v-show="superChat.enable" title="规则配置" style="width:100%" :flex="true">
			<rule v-model="superChat.rules" />
		</row-frame>
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { displayType } from "./data";
import { superChat } from "@/electron_browser/datas/aboutDanmaku";
import { mapState } from "vuex";
import { ElMessage } from "element-plus";
import cloneDeep from "lodash/cloneDeep";
import rule from "./rules.vue";
export default defineComponent({
	name: "superChat",
	components: { rule },
	data() {
		return {
			superChat: superChat()
		};
	},
	computed: {
		...mapState(["danmakuProfile"]),
		displayType
	},
	mounted() {
		this.superChat =
			cloneDeep(this.danmakuProfile.common.superChat) || superChat();
	},
	methods: {
		save() {
			if (!this.saveCheck()) {
				return;
			}
			this.danmakuProfile.common.superChat = cloneDeep(this.superChat);
			this.$store.commit("updateSettings", {});
			ElMessage({
				message: "设置已保存",
				duration: 1500,
				type: "success",
				offset: 60
			});
		},
		sort() {
			this.superChat.rules.sort((a: any, b: any) => {
				return b.triggerValue - a.triggerValue;
			});
			this.superChat.rules = [...this.superChat.rules];
		},
		saveCheck() {
			this.sort();
			let previous: any = null;
			let errmsg = "";
			this.superChat.rules.forEach((rule: any) => {
				if (!previous) {
					previous = rule;
					return;
				}
				if (rule.triggerValue === previous.triggerValue) {
					errmsg = "错误：存在多个金额相同的规则";
					return;
				}
				if (rule.listDuration > previous.listDuration) {
					errmsg = "错误：金额越大的规则持续时间应该越长";
				}
			});
			if (errmsg) {
				ElMessage({
					message: errmsg,
					duration: 1500,
					type: "error",
					offset: 60
				});
			}
			return !errmsg;
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/scrollbar.scss";
#superChat {
	position: absolute;
	width: 100%;
	height: 100%;
	@include scrollbarDark();
}
</style>
