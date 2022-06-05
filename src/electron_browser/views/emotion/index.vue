<template>
	<content-frame id="emotion">
		<row-frame width="100%" flex>
			<row-span :span="2">
				开启表情
			</row-span>
			<row-span :span="2">
				<el-switch v-model="emoOn" />
			</row-span>
			<row-span :span="4">
				单条弹幕数量限制（防刷屏）
			</row-span>
			<row-span :span="2">
				<el-input-number size="mini" :min="1" v-model="emoMax" />
			</row-span>
			<row-span style="text-align:right" :span="2">
				<el-button size="mini" @click="save" type="primary" style="margin-top:-8px">保存</el-button>
			</row-span>
		</row-frame>
		<row-frame width="100%" title="表情预览" v-show="emoOn">
			<div class="list-add-btn">
				<el-button type="text" style="padding:0px!important;min-height:0px!important"
					@click="danmaku =  getMockByType(1000);currentEmoji = {...currentEmoji}">换条弹幕</el-button>
			</div>
			<zoom-frame :allow-zoom="true" class="zoom-frame">
				<div v-if="!setting">请先去“弹幕流”中进行弹幕样式配置</div>
				<div v-else-if="!currentEmoji">添加并选择表情来预览</div>
				<danmaku-row v-else style="white-space:nowrap" :setting="setting" :configMode="true"
					:danmaku="danmakuWithEmoji" />
			</zoom-frame>
			<div class="hint">表情可使用emoji或关键词替换，关键词替换在发送时需加“#"的前缀，例如要发“举高高”，则需发送“#举高高”</div>
			<div class="hint">为提升用户体验，请尽量使用emoji替换表情(关键词旁的😀)</div>
			<div class="hint">如果显示别扭，请到弹幕流-样式设置中，把所有评论组件的第一个“垂直排布”设置为底端</div>
		</row-frame>

		<row-frame width="100%" title="表情列表" v-show="emoOn">
			<div class="emoji-list">
				<div class="card-box">
					<el-card shadow="always" class="card add" @click="add">添加+</el-card>
				</div>
				<div class="card-box" v-for="(emoji,index) in emos" :key="index">
					<el-card class="card" shadow="hover" :body-style="{ padding: '0px'}"
						@mouseenter="currentEmoji=emoji">
						<span class="el-icon-error  remove" @click="emos = emos.filter(i=>i!==emoji)" />
						<img-input-static fit="contain" style="height:120px;width: 100%" v-model="emoji.url" />
						<div style="display:flex;padding:0px 14px;justify-content:space-between">
							<div style="width:35%">
								大小<br>
								<el-button-group>
									<el-button class="btn" type="primary" icon="el-icon-plus" size="mini"
										@click="emoji.scale<200?emoji.scale+=2:false" />
									<el-button class="btn" type="primary" icon="el-icon-minus" size="mini"
										@click="emoji.scale>0?emoji.scale-=2:false" />
								</el-button-group>
							</div>
							<div style="width:60%">
								关键词
								<emoji-picker :showSelected="false" v-model="emoji.pattern">
									<div class="emoji-picker">😀</div>
								</emoji-picker>
								<el-input placeholder="关键词/emoji" size="mini"
									:modelValue="emoji.pattern.replaceAll('#','')"
									@update:modelValue="emoji.pattern = '#' +$event.replaceAll('#','')" />
							</div>
						</div>
					</el-card>
				</div>
			</div>
		</row-frame>

		<!--  -->
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cloneDeep from "lodash/cloneDeep";
import zoomFrame from "@front/util_component/frames/zoomFrame.vue";
import danmakuRow from "@/electron_browser/components/danmakuFlow/danmakuRow/index.vue";
import { getMockByType } from "@front/views/danmakuSetting/mock/index";
import emojiPicker from "@front/components/form/emojiPicker/index.vue";
import { ElMessage } from "element-plus";
export default defineComponent({
	name: "emotion",
	components: { zoomFrame, danmakuRow, emojiPicker },
	data() {
		const emos =
			cloneDeep(this.$store.state.danmakuProfile.common.emojis) || [];
		const danmakuWithEmoji: any = "";
		const emoOn = this.$store.state.danmakuProfile.common.emotion;
		const emoMax = this.$store.state.danmakuProfile.common.emotionMax || 3;
		return {
			emos,
			emoOn,
			emoMax,
			currentEmoji: false,
			danmaku: getMockByType(1000),
			danmakuWithEmoji
		};
	},
	watch: {
		currentEmoji: {
			handler(n: any) {
				const emoji: any = this.currentEmoji;
				if (!emoji || !this.danmaku) {
					this.danmakuWithEmoji = false;
					return;
				}
				const danmaku: any = this.danmaku;
				this.danmakuWithEmoji = {
					...danmaku,
					data: {
						...danmaku.data,
						content:
							danmaku.data.content +
							`<img style="max-width:${n.scale}px;margin-left:8px;vertical-align:bottom" src="${n.url}"/>`
					}
				};
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		setting() {
			try {
				return this.$store.state.danmakuProfile?.toolBox?.settingOfType[
					"1000"
				];
			} catch (error) {
				console.error(error);
				return false;
			}
		}
	},
	methods: {
		getMockByType,
		save() {
			this.$store.state.danmakuProfile.common.emotion = this.emoOn;
			this.$store.state.danmakuProfile.common.emotionMax = this.emoMax;
			this.$store.state.danmakuProfile.common.emojis = this.emos.filter(
				(i: any) => i.pattern && i.url
			);
			this.$store.commit("updateSettings", {});
			ElMessage({
				message: "设置已保存",
				duration: 1500,
				type: "success",
				offset: 60
			});
		},
		add() {
			this.emos = [
				{
					pattern: "",
					url: "",
					scale: 100
				},
				...this.emos
			];
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
@import "@front/styles/backgrounds.scss";
#emotion {
	position: relative;
	height: 100%;
	flex-wrap: nowrap;
	.list-add-btn {
		position: absolute;
		right: 0px;
		top: 0px;
	}
	.zoom-frame {
		width: 100%;
		height: 100px;
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
			opacity: 0.5;
		}
	}
	.emoji-list {
		width: 100%;
		box-sizing: border-box;
		height: 200px;
		overflow-y: scroll;
		@include scrollbarDark();
		display: flex;
		flex-wrap: wrap;
		.card-box {
			width: calc(100% / 4 - 16px) !important;
			height: 0px;
			margin-top: 8px;
			margin-right: 16px;
			position: relative;
			flex-shrink: 0;
			padding-bottom: calc(100% / 4);
			margin-bottom: 16px;
			.card {
				overflow: visible;
				position: absolute;
				left: 0px;
				top: 0px;
				right: 0px;
				bottom: 0px;
				.remove {
					color: $--color-danger;
					font-size: $--font-size-extra-large;
					position: absolute;
					top: 0px;
					right: 0px;
					transform: translateX(50%) translateY(-50%);
					z-index: 100;
					cursor: pointer;
				}
			}
			.add {
				border-radius: 8px;
				border: 5px dashed $--border-color-base;
				cursor: pointer;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.btn {
				padding: 7px 4px;
				margin-left: 0px !important;
			}
			.emoji-picker {
				font-size: 12px !important;
				cursor: pointer;
				user-select: none;
			}
		}
	}
}
</style>
