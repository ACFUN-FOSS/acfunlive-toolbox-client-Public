<template>
	<content-frame align="row" id="robot">
		<span class="hint">鸡鸡人（机器人）即tts语音，请先点击试听确定系统支持此功能 鸡鸡人的语音等待列表为10条，超出后最早的语音会被略过</span>
		<span class="hint">鸡鸡人仅会朗读设置了规则并且通过了弹幕流过滤的弹幕，并且不会朗读纯表情评论</span>
		<span class="hint">讯飞语音需要在<a href="https://passport.xfyun.cn/register" target="_blank">这里</a>注册并获取密匙</span>
		<span class="hint">###新增音频朗读，需要将mp3格式的音频文件放在<a @click.stop="openVoiceFolder" href="#">这里</a>###<a
				@click.stop="getVoiceList()" href="#">刷新音频列表</a></span>
		<row-frame width="100%" title="通用设置">
			<vue-form :form-footer="{show:false}" v-model="robotSetting" :schema="schema" :ui-schema="uiSchema" />
			<row-span :span="4">
				<el-button size="mini" style="margin-top:-8px" type="primary" @click="save">保存</el-button>
			</row-span>

		</row-frame>
		<row-frame width="100%" wi v-for="type in typeOptions" :title="type.label" :key="type.value">
			<rule-chain v-if="robotSetting.enable.includes(type.value)" :allow="type.value"
				v-model="robotSetting.rules[type.value]" :voice-list="voices" />
			<el-button v-if="robotSetting.enable.includes(type.value)" size="mini"
				:disabled="!robotSetting.rules[type.value].length" @click="preview(type.value)" style="margin-top:8px">
				点击试听</el-button>
			<el-checkbox style="margin-left:8px" :model-value="robotSetting.enable.includes(type.value)"
				@update:model-value="switchType($event,type.value)">开启</el-checkbox>
		</row-frame>
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import { robotSetting } from "@/electron_browser/datas/aboutDanmaku";
import { typeOptions } from "@front/components/danmakuFlow/utils/data";
import { read } from "@front/api/robot";
import { getVoiceList, openFolder } from "@front/util_function/system";
import { getMockByType } from "@front/views/danmakuSetting/mock/index";
import ruleChain from "./ruleChain.vue";
import VueForm from "@lljj/vue3-form-element";
import { ElMessage } from "element-plus";
import { uiSchema, schema } from "./rule";
export default defineComponent({
	name: "robot",
	components: {
		ruleChain,
		VueForm
	},
	data() {
		const voices: any = [];
		return {
			uiSchema: uiSchema(),
			schema: schema(),
			robotSetting: robotSetting(),
			voices
		};
	},
	beforeMount() {
		if (this.danmakuProfile.toolBox.robotSetting) {
			this.robotSetting = Object.assign(
				this.robotSetting,
				cloneDeep(this.danmakuProfile.toolBox.robotSetting)
			);
			if (!Array.isArray(this.robotSetting.enable)) {
				this.robotSetting.enable = [];
			}
		}
		this.getVoiceList();
	},
	computed: {
		typeOptions,
		...mapState(["danmakuProfile"])
	},
	methods: {
		openVoiceFolder() {
			openFolder("./voices");
		},
		getVoiceList() {
			getVoiceList().then((res: any) => {
				this.voices = res.list;
			});
		},
		switchType(on: boolean, type: any) {
			this.robotSetting.enable = this.robotSetting.enable.filter(
				ty => ty !== type
			);
			if (on) {
				this.robotSetting.enable.push(type);
			}
		},
		preview(type: number) {
			const danmaku = getMockByType(type);
			const { speed, volume, rtype, api } = this.robotSetting;
			read({
				danmaku,
				speed,
				volume,
				rtype,
				api,
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
@import "@front/styles/scrollbar.scss";

#robot {
	position: absolute;
	box-sizing: border-box;
	height: 100%;
	@include scrollbarDark();
	overflow-x: hidden;
}
</style>
