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
			<div class="list-add-btn" style="top:0px">
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
				<div v-else-if="!currentWidgets.length">请在左下添加组件</div>
				<danmaku-row
					style="white-space:nowrap"
					v-else
					:setting="currentStyle"
					:config-mode="true"
					:danmaku="mockDanmaku"
				/>
			</zoom-frame>
		</row-frame>
		<row-frame :flex="true" width="100%" style="margin-bottom:0px">
			<row-span :span="4">
				<row-frame width="100%" title="组件列表">
					<div class="list-add-btn" style="top:-10px">
						<el-dropdown :max-height="200" trigger="hover">
							<el-button type="text" :disabled="!currentStyle"
								>添加</el-button
							>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										v-show="
											!(
												widget.widgetOptions.avaliable
													.length &&
												!widget.widgetOptions.avaliable.includes(
													styleType
												)
											)
										"
										v-for="widget in widgets"
										style="width:150px"
										:key="widget.id"
										@click="addWidget(widget)"
									>
										{{ widget.label }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
					<base-list
						style="height:290px"
						:list="currentWidgets"
						:selected="currentWidget"
						:action="action"
					/>
				</row-frame>
			</row-span>
			<row-span :span="8">
				<row-frame width="100%" title="设置参数">
					<div
						v-show="widgetSelected"
						class="list-add-btn"
						style="top:0px;left:60px"
					>
						当前设置对象：{{ currentWidget.label }}
					</div>
					<div class="list-add-btn" style="top:-10px">
						<el-button
							type="text"
							:disabled="!widgetSelected"
							@click="
								styleDialog = true;
								generateList();
							"
							>拉取样式
						</el-button>
					</div>
					<div class="content" style="height:290px;overflow-y:auto">
						<vue-form
							:form-footer="{ show: false }"
							v-model="currentWidget.value"
							v-if="widgets[currentWidget.labelEn]"
							:schema="widgets[currentWidget.labelEn].styleForm"
						/>
						<div
							style="position:absolute;left:50%;top:50%;transform:translateX(-50%)"
							v-else
						>
							右方选择组件
						</div>
					</div>
				</row-frame>
			</row-span>
		</row-frame>
	</content-frame>
	<el-dialog
		title="样式拉取(尽量用于拉取相同组件的样式，对于不同组件可能会出错)"
		v-model="styleDialog"
	>
		<el-cascader
			:options="styleOption"
			v-model="styleOptionValue"
			@change="getStyle"
			placeholder="请选择拉取样式"
		/>
	</el-dialog>
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
import { randomId } from "@front/util_function/base";
import { loadAsText } from "@front/util_function/file";
import { toJSON } from "@front/util_function/exportTo";
import widgets from "@front/components/danmakuFlow/widgets";
import danmakuRow from "@/electron_browser/components/danmakuFlow/danmakuRow/index.vue";
import { getMockByType } from "@front/views/danmakuSetting/mock";
import VueForm from "@lljj/vue3-form-element";
import { ElMessage } from "element-plus";
import { hint } from "./qa";
export default defineComponent({
	name: "danmakuStyleConfig",
	components: { zoomFrame, baseList, danmakuRow, VueForm },
	data() {
		const currentWidgets: Array<any> = [];
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
			widgets,
			currentWidgets, // 当前弹幕类型里的组件列表
			currentStyle: false, // 当前弹幕类型设置
			currentWidget: {}, // 当前编辑的组件
			brightness: 50,
			action: [
				{
					icon: "el-icon-setting",
					// @ts-ignore
					action: this.selectWidget
				},
				{
					icon: "el-icon-top",
					// @ts-ignore
					action: this.moveWidget(-1)
				},
				{
					icon: "el-icon-bottom",
					// @ts-ignore
					action: this.moveWidget(1)
				},
				{
					icon: "el-icon-close",
					// @ts-ignore
					action: this.removeWidget
				}
			]
		};
	},
	computed: {
		...mapGetters(["danmakuProfile"]),
		typeOptions,
		mockDanmaku(): any {
			// @ts-ignore
			return getMockByType(this.styleType);
		},
		enable(): boolean {
			return Boolean(this.styles);
		},
		widgetSelected(): boolean {
			// @ts-ignore
			return Boolean(this.currentWidget?.id);
		}
	},
	watch: {
		styleType(n, o) {
			if (!n) {
				return;
			} // @ts-ignore
			this.styles[n] = this.currentStyle =
				this.styles[n] || styleConfig(this.styleType);
		},
		currentStyle: {
			handler(n, o) {
				this.currentWidgets = n?.widgets || [];
			},
			deep: true
		},
		currentWidgets: {
			handler(n, o) {
				try {
					// @ts-ignore
					this.currentStyle.widgets = n;
				} catch (error) {}
			},
			deep: true
		}
	},
	methods: {
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
			this.currentWidgets = [];
			this.currentWidget = {};
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
		addWidget(widget: any) {
			if (!this.currentWidgets) {
				this.currentWidgets = [];
			}
			const sameWidgetNum = this.currentWidgets.filter((i: any) => {
				return i.labelEn === widget.labelEn;
			}).length;
			const limit = widget.widgetOptions.limit;
			if (limit && limit === sameWidgetNum) {
				ElMessage({
					message: `${widget.label} 在本类型弹幕中只能有${limit}个`,
					duration: 1500,
					type: "error",
					offset: 60
				});
				return;
			}
			this.currentWidgets = [
				...this.currentWidgets,
				{
					id: randomId(6),
					label: widget.label,
					labelEn: widget.labelEn,
					value: cloneDeep(widget.styleValue)
				}
			];
		},
		removeWidget(i: any) {
			if (this.currentWidget === i) {
				this.currentWidget = "";
			}
			this.currentWidgets = this.currentWidgets.filter((o: any) => {
				return i !== o;
			});
			return this.currentWidgets;
		},
		moveWidget(o: number): any {
			return (i: any) => {
				const currentIndex = this.currentWidgets.indexOf(i);
				if (o < 0) {
					if (currentIndex === 0) {
						return;
					}
					this.removeWidget(i).splice(currentIndex - 1, 0, i);
					this.currentWidgets = [...this.currentWidgets];
					return;
				}
				if (currentIndex === this.currentWidgets.length - 1) {
					return;
				}
				this.removeWidget(i).splice(currentIndex + 1, 0, i);
				this.currentWidgets = [...this.currentWidgets];
			};
		},
		selectWidget(i: any) {
			this.currentWidget = i;
		},
		generateList() {
			this.styleOptionValue = [];
			const generateMenu = (style: any) => {
				const output = [];
				for (const option of this.typeOptions) {
					const styleOfType: any = style[option.value];
					if (!styleOfType?.widgets.length) {
						continue;
					}
					output.push({
						label: styleOfType.label || styleOfType.name,
						children: styleOfType.widgets.map((widget: any) => {
							return {
								label: widget.label,
								value: widget.value
							};
						})
					});
				}
				return output;
			};
			this.styleOption = [
				{
					label: "编辑中样式",
					children: generateMenu(this.styles)
				},
				{
					label: "主播弹幕样式",
					children: generateMenu(
						this.danmakuProfile("toolBox").settingOfType
					)
				},
				{
					label: "观众弹幕样式",
					children: generateMenu(
						this.danmakuProfile("web").settingOfType
					)
				}
			].filter(i => i.children.length);
		},
		getStyle(e: any) {
			const value = e.pop();
			const currentWidget: any = this.currentWidget;
			if (value) {
				for (const key in currentWidget.value) {
					// if (key === "config") {
					// 	continue;
					// }
					if (value[key]) {
						Object.assign(currentWidget.value[key], value[key]);
					}
				}
			}
			this.styleDialog = false;
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
