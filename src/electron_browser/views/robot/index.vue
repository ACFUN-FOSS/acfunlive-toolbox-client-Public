<template>
	<content-frame align="row" id="robot">
		<span class="hint">鸡鸡人（机器人）即tts语音，请先点击试听确定系统支持此功能 鸡鸡人的语音等待列表为10条，超出后最早的语音会被略过</span>
		<span class="hint">鸡鸡人仅会朗读设置了规则并且通过了弹幕流过滤的弹幕，并且不会朗读纯表情评论</span>
		<span class="hint">好听的鸡鸡人需要收费 么得办法啦~ </span>
		<row-frame width="100%" title="通用设置" flex>
			<row-span style="text-align:right" :span="1">
				开启
			</row-span>
			<row-span style="text-align:left" :span="2">
				<el-switch v-model="robotSetting.enable" />
			</row-span>
			<row-span style="text-align:right" v-show="robotSetting.enable" :span="1">
				速度
			</row-span>
			<row-span style="text-align:left" v-show="robotSetting.enable" :span="2">
				<el-slider style="height:20px;display:flex;align-items:center" type="number" size="mini" v-model="robotSetting.speed" :min="-10" :max="10" />
			</row-span>
			<row-span style="text-align:right" v-show="robotSetting.enable" :span="2">
				音量
			</row-span>
			<row-span style="text-align:left" v-show="robotSetting.enable" :span="2">
				<el-slider style="height:20px;display:flex;align-items:center" type="number" size="mini" v-model="robotSetting.volume" :min="0" :max="100" />
			</row-span>
			<row-span style="text-align:right;" :span="2">
				<el-button size="mini" style="margin-top:-8px" type="primary" @click="save">保存</el-button>
			</row-span>
		</row-frame>
		<row-frame width="100%" wi v-for="type in typeOptions" v-show="robotSetting.enable" :title="type.label" :key="type.value">
			<rule-chain :allow="type.value" v-model="robotSetting.rules[type.value]" />
			<el-button size="mini" :disabled="!robotSetting.rules[type.value].length" @click="preview(type.value)" style="margin-top:8px">点击试听</el-button>
		</row-frame>
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { cloneDeep } from "lodash";
import { robotSetting } from "@front/datas/danmaku";
import { typeOptions } from "@front/components/danmakuFlow/utils/data";
import { read } from "@front/api/robot";
import { getMockByType } from "@front/views/danmakuSetting/mock/index";
import ruleChain from "./ruleChain.vue";
import { ElMessage } from "element-plus";
export default defineComponent({
	name: "robot",
	components: {
		ruleChain
	},
	data() {
		return {
			robotSetting: robotSetting()
		};
	},
	mounted() {
		if (this.danmakuProfile.toolBox.robotSetting) {
			this.robotSetting = Object.assign(
				this.robotSetting,
				cloneDeep(this.danmakuProfile.toolBox.robotSetting)
			);
		}
	},
	computed: {
		typeOptions,
		...mapState(["danmakuProfile"])
	},
	methods: {
		preview(type: number) {
			const danmaku = getMockByType(type);
			const { speed, volume } = this.robotSetting;
			read({
				danmaku,
				speed,
				volume,
				rules: this.robotSetting.rules[type]
			});
		},
		save() {
			this.danmakuProfile.toolBox.robotSetting = this.robotSetting;
			this.$store.commit("updateSettings", {});
			ElMessage({
				message: "设置已保存",
				duration: 1500,
				type: "success",
				offset: 60
			});
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/index.scss";

#robot {
	position: absolute;
	box-sizing: border-box;
	height: 100%;

	@include scrollbarDark();
}
</style>
