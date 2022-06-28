<template>
	<content-frame
		align="row"
		class="danmaku-setting"
		:style="{ '--brightness': brightness / 100 }"
	>
		<row-span :span="12">
			<span class="hint">
				用之前康康Q&A：
				<popver-help width="700px" trigger="hover">
					<div
						v-for="(hin, index) in hint"
						:key="index"
						style="margin-bottom:8px"
					>
						Q:<span class="hint" v-html="hin.q" /><br />
						A:<span class="hint" v-html="hin.a" />
					</div>
				</popver-help>
			</span>
		</row-span>
		<row-frame :flex="true" width="100%" style="margin-bottom:0px">
			<row-span :span="2">
				<row-frame width="100%" title="step1:导入">
					<el-dropdown
						@command="loadCommand"
						type="primary"
						trigger="click"
						style="line-height:28px"
					>
						<el-button size="mini" type="primary">
							导入样式，从
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="toolBox"
									>当前主播样式</el-dropdown-item
								>
								<el-dropdown-item command="web"
									>当前观众样式</el-dropdown-item
								>
								<el-dropdown-item command="d-toolBox"
									>默认主播样式</el-dropdown-item
								>
								<el-dropdown-item command="d-web"
									>默认观众样式</el-dropdown-item
								>
								<el-dropdown-item command="file"
									>文件</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</row-frame>
			</row-span>
			<row-span :span="8.5">
				<row-frame width="100%" title="step2:选择类型编辑">
					<el-radio-group
						@change="currentWidget = {}"
						:disabled="!enable"
						size="mini"
						v-model="styleType"
						class="setting-bar"
					>
						<el-radio-button
							v-for="type in typeOptions"
							:label="type.value"
							:key="type.value"
						>
							{{ type.label }}
						</el-radio-button>
					</el-radio-group>
				</row-frame>
			</row-span>
			<row-span :span="1.5">
				<row-frame width="100%" title="step3:保存">
					<el-dropdown
						@command="saveCommand"
						type="primary"
						trigger="click"
						style="line-height:28px"
					>
						<el-button
							size="mini"
							type="primary"
							:disabled="!enable"
						>
							保存到
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="toolBox"
									>主播端</el-dropdown-item
								>
								<el-dropdown-item command="web"
									>观众端</el-dropdown-item
								>
								<el-dropdown-item command="both"
									>主播&观众端</el-dropdown-item
								>
								<el-dropdown-item command="file"
									>文件</el-dropdown-item
								>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</row-frame>
			</row-span>
		</row-frame>
		<row-frame width="100%" title="这是预览">
			<div
				class="list-add-btn"
				style="top:-10px;display:flex; align-items:center"
			>
				<div class="slider">
					背景亮度：
					<el-slider
						style="width:100px"
						v-model="brightness"
						:min="20"
						:max="100"
						:step="1"
					/>
				</div>
				<el-checkbox v-model="zoomPreview">缩放</el-checkbox>
				<el-button
					type="text"
					style="margin:0px 16px"
					@click="changeDanmaku"
					>换条弹幕</el-button
				>
			</div>
			<zoom-frame
				:allow-zoom="zoomPreview"
				class="zoom-frame"
				:styles="{ width: '100%', height: '60px' }"
			>
				<div v-if="!enable">么得内容，请先在上方导入样式</div>
				<div v-else-if="!currentStyle">
					请先在上选择要编辑的弹幕类型
				</div>
				<div v-else-if="!currentStyle.advHtml">
					请在下方编辑代码，所见即所得
				</div>
				<danmaku-row
					style="white-space:nowrap"
					v-else
					:setting="currentStyle"
					:config-mode="true"
					:danmaku="mockDanmaku"
					:key="styleType"
				/>
			</zoom-frame>
		</row-frame>
		<row-frame
			:flex="true"
			width="100%"
			style="margin-bottom:0px"
			v-if="currentStyle"
		>
			<row-span :span="8">
				<row-frame
					width="100%"
					title="HTML(VUE模板语法，最外侧不需要template)"
				>
					<textarea
						ref="editor"
						v-model="currentStyle.advHtml"
						style="height:110px;width:450px;resize: none"
						@blur="recordSelection"
						@focus="recoverSelection"
						@change="getAdvId"
					/>
				</row-frame>
				<row-frame width="100%" title="CSS">
					<textarea
						v-model="currentStyle.advCss"
						style="height:110px;width:450px;resize: none"
						@change="getAdvId"
					/>
				</row-frame>
			</row-span>
			<row-span :span="4">
				<row-frame width="100%" title="函数列表">
					<base-list
						style="height:240px"
						:list="functionList"
						:action="action"
					/>
					<el-button
						style="margin-top:8px"
						size="mini"
						type="primary"
						@click="openDocument"
						>说明文档</el-button
					>
					<el-button
						style="margin-top:8px"
						size="mini"
						type="primary"
						@click="openResources"
						>素材文件夹
					</el-button>
				</row-frame>
			</row-span>
		</row-frame>
	</content-frame>
</template>

<script lang="ts">
import {
	typeOptions,
	styleConfig
} from "@front/components/danmakuFlow/utils/data";
import zoomFrame from "@front/util_component/frames/zoomFrame.vue";
import baseList from "@front/components/base/list/base.vue";
import cloneDeep from "lodash/cloneDeep";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { loadAsText } from "@front/util_function/file";
import { toJSON } from "@front/util_function/exportTo";
import danmakuRow from "@/electron_browser/components/danmakuFlow/danmakuRow/index.vue";
import { getMockByType } from "@front/views/danmakuSetting/mock";
import { ElMessage } from "element-plus";
import { hint } from "./qa";
import advFunctions from "@front/components/danmakuFlow/danmakuRow/advanceFunctions";
import { randomId } from "@front/util_function/base";
import { openFile, openFolder } from "@front/util_function/system";
import path from "path";
export default defineComponent({
	name: "danmakuStyleConfig",
	components: { zoomFrame, danmakuRow, baseList },
	data() {
		const styleOption: Array<any> = [];
		const styleOptionValue: Array<any> = [];
		return {
			hint: hint(),
			zoomPreview: true,
			styleDialog: false, // 拉取样式选框
			styleOption, // 拉取样式菜单
			styleOptionValue, // 拉取样式缓存用
			styleType: "",
			styles: "",
			currentStyle: false, // 当前弹幕类型设置
			brightness: 50,
			selectionStart: 0,
			selectionEnd: 0,
			mockDanmaku: {},
			action: [
				{
					icon: "el-icon-copy-document",
					action: (e: any) => {
						const editor: any = this.$refs.editor;
						const that: any = this;
						editor.value =
							editor.value.slice(0, that.selectionStart) +
							e.label +
							editor.value.slice(that.selectionEnd);
						that.selectionStart += e.label.length;
						that.selectionEnd = that.selectionStart;
						editor.focus();
					}
				}
			]
		};
	},
	mounted() {
		this.changeDanmaku();
	},
	computed: {
		...mapGetters(["danmakuProfile"]),
		typeOptions,
		enable(): boolean {
			return Boolean(this.styles);
		},
		functionList() {
			return Object.keys(advFunctions).map(i => {
				return {
					label: i,
					value: i
				};
			});
		}
	},
	watch: {
		styleType(n, o) {
			if (!n) {
				return;
			} // @ts-ignore
			this.styles[n] = this.currentStyle =
				this.styles[n] || styleConfig(this.styleType);
			this.changeDanmaku();
		}
	},
	methods: {
		openResources() {
			openFolder("./selfDanmaku");
		},
		openDocument() {
			openFile({
				url: path.join(
					process.resourcesPath,
					"../使用说明/高级样式定制说明.txt"
				),
				create: false
			});
		},
		getAdvId() {
			if (this.currentStyle) {
				//@ts-ignore
				this.currentStyle.advId = randomId(8);
			}
		},
		changeDanmaku() {
			this.mockDanmaku = getMockByType(this.styleType);
		},
		recordSelection() {
			const editor: any = this.$refs.editor;
			this.selectionStart = editor.selectionStart;
			this.selectionEnd = editor.selectionEnd;
		},
		recoverSelection() {
			const editor: any = this.$refs.editor;
			editor.selectionStart = this.selectionStart;
			editor.selectionEnd = this.selectionEnd;
		},
		loadCommand(command: string) {
			const loadFromStore = (type: string) => {
				this.styles = cloneDeep(
					this.danmakuProfile(type).settingOfType
				);
				ElMessage({
					message: "读取成功",
					duration: 1500,
					type: "success"
				});
			};
			const loadFromFile = async () => {
				const res: any = await loadAsText(".json");
				if (res) {
					this.styles = JSON.parse(res);
				} else {
					ElMessage({
						duration: 1500,
						type: "error",
						message: "读取失败"
					});
				}
			};
			const reset = (type: string) => {
				type = type.replace("d-", "");
				fetch(`/styles/${type}.json`)
					.then((res: any) => res.json())
					.then((json: any) => {
						this.styles = json;
					});
			};
			this.styleType = "";
			this.currentStyle = false;
			switch (command) {
				case "toolBox":
				case "web":
					loadFromStore(command);
					break;
				case "file":
					loadFromFile();
					break;
				case "d-toolBox":
				case "d-web":
					reset(command);
					break;
				default:
					break;
			}
		},
		saveCommand(command: string) {
			const saveToFile = () => {
				toJSON("新弹幕样式", this.removeStyleForm(this.styles));
			};
			switch (command) {
				case "toolBox":
				case "web":
					this.$store.commit("updateStyle", {
						styleType: command,
						style: this.removeStyleForm(this.styles)
					});
					break;
				case "both":
					this.$store.state.danmakuProfile.web.settingOfType = this.$store.state.danmakuProfile.toolBox.settingOfType = this.removeStyleForm(
						this.styles
					);
					this.$store.commit("updateStyle", {});
					break;
				case "file":
					saveToFile();
					break;
				default:
					break;
			}
			ElMessage({
				message: "保存成功",
				duration: 1500,
				type: "success"
			});
		},
		removeStyleForm(style: any) {
			const newStyle = cloneDeep(style);
			try {
				Object.keys(newStyle).forEach((key: any) => {
					try {
						if (!newStyle[key].widgets) {
							return;
						}
						newStyle[key].widgets.forEach((widget: any) => {
							try {
								delete widget.styleForm;
							} catch (error) {}
						});
					} catch (error) {}
				});
			} catch (error) {}
			return newStyle;
		}
	}
});
</script>

<style scoped lang="scss">
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
@import "@front/styles/backgrounds.scss";
.setting-bar {
	:deep .el-radio-button--mini .el-radio-button__inner {
		padding: 7px 10px !important;
	}
}
.zoom-frame {
	position: relative;
	z-index: 2;
	background-color: black;
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url($gird);
		opacity: var(--brightness);
	}
}
.list-add-btn {
	position: absolute;
	right: 0px;
	display: flex;
}
.slider {
	display: flex;
	align-items: center;
	margin-top: -10px;
	margin-right: 20px;
}
.drop-down-item {
	width: 150px;
}
.content {
	@include scrollbarDark();
	width: calc(100%);
}
</style>
