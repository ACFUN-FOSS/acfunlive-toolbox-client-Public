<template>
	<div class="super-chat-rule">
		<div class="rule-block" v-for="(rule,index) in rules" :key="index">
			<el-divider><span class="tips">规则{{index+1}}</span></el-divider>
			<row-frame title="" style="width:100%" :flex="true">
				<row-span :span="3">
					<p>金额（AC币）</p>
					<div class="number-input">
						>=
						<el-input-number :step="10" :min="0" size="mini" v-model="rule.triggerValue" />
					</div>
				</row-span>
				<row-span :span="2">
					<p>持续时间(秒)</p>
					<el-input-number size="mini" :min="15" :modelValue="rule.listDuration/1000" @update:modelValue="rule.listDuration=$event*1000" />
				</row-span>
				<row-span :span="3.5">
					<p>选择主题</p>
					<el-select placeholder="请选择主题面板" size="mini" v-model="rule.themeID" @change="applyTheme(rule,$event)">
						<el-option label="默认" value="0" />
						<el-option v-for="theme in themes" :key="theme.id" :label="theme.label" :value="theme.id" />
					</el-select>
				</row-span>
				<row-span style="text-align:right" :span="3.5">
					<p>&nbsp;</p>
					<el-button size="mini" type="danger" @click="remove(rule)">删除</el-button>
				</row-span>
			</row-frame>
		</div>
		<el-button style="width:100%;text-align:center" size="mini" type="primary" @click="add">添加+</el-button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import clone from "lodash/clone";
import { backgroundType } from "./data";
import { superChatBlockSetting } from "@front/components/superChat/utils/data";
import { loadSuperChat } from "@front/util_function/system";
import defaultTheme from "./../style/default";
export default defineComponent({
	name: "superChatRule",
	props: {
		modelValue: {
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			themes: []
		};
	},
	computed: {
		defaultTheme,
		backgroundType,
		rules: {
			get(): any {
				return this.modelValue;
			},
			set(e: any) {
				this.$emit("update:modelValue", e);
			}
		}
	},
	mounted() {
		this.getTheme();
	},
	methods: {
		add() {
			const previous =
				clone(this.rules.slice(-1)[0]) || superChatBlockSetting();
			this.rules.push({
				...previous,
				triggerValue: previous.triggerValue + 1,
				listDuration: previous.listDuration + 5000
			});
		},
		remove(rule: any) {
			this.rules = this.rules.filter((rul: any) => rule !== rul);
		},
		getTheme() {
			loadSuperChat()
				.then((res: any) => {
					this.themes = res.list;
				})
				.catch(() => {
					this.themes = [];
				});
		},
		applyTheme(rule: any, themeID: any) {
			if (themeID === "0") {
				rule.theme = defaultTheme();
				return;
			}

			const theme: any = this.themes.find(
				(theme: any) => theme.id === themeID
			);
			if (theme) {
				rule.theme = theme.value;
			} else {
				rule.themeID = "";
			}
		}
	}
});
</script>

<style scoped lang='scss'>
.super-chat-rule {
	width: 100%;
	.number-input {
		display: flex;
		align-items: center;
		& > div {
			flex-grow: 1;
			:deep .el-input__inner {
				width: 100% !important;
			}
		}
	}
}
</style>
