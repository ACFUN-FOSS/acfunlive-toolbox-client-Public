<template>
	<content-frame align="column" class="danmaku-setting">
		<row-frame :flex="true" style="margin-bottom:0px">
			<row-span :span="12">
				<row-frame width="100%" title="胶囊预览">
					<zoom-frame :allow-zoom="true" class="zoom-frame" style="height:50px">
						<list-block v-if="theme" :scBlock="block" />
					</zoom-frame>
				</row-frame>
			</row-span>
			<row-span :span="12">
				<row-frame width="100%" title="面板预览">
					<zoom-frame :allow-zoom="false" class="zoom-frame" style="height:150px">
						<list-panel v-if="theme" :configMode="true" :scBlock="block" />
					</zoom-frame>
				</row-frame>
			</row-span>
		</row-frame>
		<row-frame style="height:100%" :flex="true">
			<row-span :span="10">
				<row-frame width="100%" title="选择主题编辑">
					<el-select v-model="themeID" @change="selectTheme" size="mini">
						<el-option key="0" label="默认" :value="0" />
						<el-option class="option" v-for="theme in themes" :key="theme.id" :label="theme.label" :value="theme.id">
							<span class="label">{{ theme.label }}</span>
							<span @click.stop.prevent="remove(theme)" class="closeBtn el-icon-circle-close" />
						</el-option>
					</el-select>
				</row-frame>
			</row-span>
			<row-span :span="2">
				<row-frame width="100%" title=" ">
					<el-dropdown @command="saveCommand" type="primary" trigger="click" style="line-height:28px" max-height="200px">
						<el-button size="mini" type="primary" :disabled="!theme">
							保存
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="save">保存</el-dropdown-item>
								<el-dropdown-item command="saveAs">存为新主题</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</row-frame>
			</row-span>
			<div class="hint">纯色背景和动态背景任选其一，动态背景请根据机器性能谨慎选择</div>
			<row-span :span="12">
				<row-frame width="100%" title="选项">
					<div class="content">
						<vue-form :form-footer="{show:false}" v-model="theme" v-if="theme" :schema="rule" />
						<div style="position:absolute;left:50%;top:50%;transform:translateX(-50%)" v-else>上方选择主题以编辑</div>
					</div>
				</row-frame>
			</row-span>
		</row-frame>
	</content-frame>
	<el-dialog title="新建主题" v-model="saveAsDialog" :show-close="false" :close-on-click-modal="false">
		主题名称：
		<el-input size="mini" v-model="newName" />
		<template #footer>
			<span class="dialog-footer">
				<el-button size="mini" @click="saveAsDialog = false;newName='新主题'">取消</el-button>
				<el-button size="mini" type="primary" @click="saveThemeAs">好的</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import zoomFrame from "@front/util_component/frames/zoomFrame.vue";
import cloneDeep from "lodash/cloneDeep";
import { defineComponent } from "vue";
import { randomId } from "@front/util_function/base";
import { getPaidGift } from "@front/views/danmakuSetting/mock";
import { scFromDanmaku } from "@front/components/superChat/utils/getter";
import VueForm from "@lljj/vue3-form-element";
import rule from "@front/views/superChat/style/form";
import listBlock from "@front/components/superChat/listBlock.vue";
import listPanel from "@front/components/superChat/listPanel.vue";
import { loadSuperChat, saveSuperChat } from "@front/util_function/system";
import defaultTheme from "./default";
import { ElMessage } from "element-plus";
export default defineComponent({
	name: "superChatStyleConfig",
	components: { zoomFrame, VueForm, listBlock, listPanel },
	data() {
		const themes: any = [];
		const theme: any = "";
		return {
			rule: rule(),
			theme,
			themes,
			themeID: "",
			newName: "新主题",
			saveAsDialog: false
		};
	},
	computed: {
		defaultTheme,
		block(): any {
			if (!this.theme) {
				return false;
			}
			const danmaku = getPaidGift();
			return scFromDanmaku(danmaku, {
				rule: {
					triggerValue: 0,
					listDuration: 1000,
					theme: this.theme,
					themeID: this.themeID
				},
				nextLevel: 10000
			});
		}
	},
	mounted() {
		this.getTheme();
	},
	methods: {
		remove(theme: any) {
			const id = theme.id;
			if (this.themeID === id) {
				this.themeID = this.theme = "";
			}
			this.themes = this.themes.filter((them: any) => them !== theme);
			saveSuperChat({
				list: this.themes
			});
			ElMessage({
				type: "success",
				duration: 1500,
				offset: 60,
				message: "删除成功！"
			});
		},
		saveCommand(command: string) {
			switch (command) {
				case "save":
					this.saveTheme();
					break;

				case "saveAs":
					this.saveAsDialog = true;
					break;
			}
		},
		selectTheme(value: any) {
			if (value === 0) {
				this.theme = defaultTheme();
			} else {
				const theme = this.themes.find(
					(theme: any) => theme.id === value
				);
				if (theme) {
					this.theme = cloneDeep(theme.value);
				}
			}
		},
		saveTheme() {
			const theme = this.themes.find(
				(theme: any) => theme.id === this.themeID
			);
			if (theme) {
				Object.assign(theme.value, this.theme);
				saveSuperChat({
					list: this.themes
				});
				const rules = this.$store.state.danmakuProfile.common?.superChat
					?.rules;
				if (rules) {
					rules.forEach((rule: any) => {
						if (rule.themeID === this.themeID) {
							rule.theme = cloneDeep(this.theme);
						}
					});
				}
			} else {
				this.saveThemeAs();
			}
			this.$store.commit("updateSettings", {});
			ElMessage({
				type: "success",
				duration: 1500,
				offset: 60,
				message: "保存成功！"
			});
		},
		saveThemeAs() {
			const id = randomId(6);
			this.themes.unshift({
				id,
				label: this.newName,
				value: cloneDeep(this.theme)
			});
			saveSuperChat({
				list: this.themes
			});
			this.newName = "新主题";
			ElMessage({
				type: "success",
				duration: 1500,
				offset: 60,
				message: "另存为成功！"
			});
			this.themeID = id;
			this.theme = cloneDeep(this.theme);
			this.saveAsDialog = false;
		},
		getTheme() {
			loadSuperChat()
				.then((res: any) => {
					this.themes = res.list;
				})
				.catch(e => {
					console.error(e);
					this.themes = [];
				});
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
@import "@front/styles/backgrounds.scss";
.content {
	height: calc(100vh - 350px);
	@include scrollbarDark();
}
.zoom-frame {
	width: 100%;
	height: 60px;
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
.option {
	display: flex;
	justify-content: space-between;
	align-items: center;
	&:hover .closeBtn {
		display: inherit;
	}
	.closeBtn {
		color: $--color-text-secondary;
		display: none;
		cursor: pointer;
		&:hover {
			color: $--color-text-primary;
		}
	}
}
</style>
