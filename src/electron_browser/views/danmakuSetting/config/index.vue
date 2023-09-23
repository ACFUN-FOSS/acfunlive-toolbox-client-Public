<template>
	<content-frame class="danmaku-setting" :style="{'--brightness':brightness/100}">
		<row-frame title="预览">
			<div class="list-add-btn" style="top:0px">
				<div class="slider">背景亮度：
					<el-slider style="width:100px" v-model="brightness" :min="20" :max="100" :step="1" />
				</div>
			</div>
			<row-span>
				<div class="danmaku-list-bg">
					<flow class="danmaku-list" :configMode="true" :danmakuList="mockData" :max="100"
						:settings="settings" />
				</div>
			</row-span>
		</row-frame>
		<row-frame title="设置对象">
			<row-span>
				<el-radio-group v-model="settingTarget" size="mini">
					<el-radio-button label="toolBox">主播版</el-radio-button>
					<el-radio-button label="web">观众版</el-radio-button>
				</el-radio-group>
			</row-span>
		</row-frame>
		<div class="right-content">
			<component v-model:settings="settings" v-model:mockData="mockData" v-for="(item,index) in settingBlocks"
				:key="index" :is="item" :setting-target="settingTarget" />
			<el-button @click="save" size="mini" type="primary">保存（{{{'toolBox':'主播端','web':'观众端'}[settingTarget]}}设置）</el-button>
			<el-button v-show="settingTarget==='toolBox'" @click="saveSync" size="mini" type="primary">保存并同步到观众端</el-button>
		</div>
	</content-frame>

</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { mapState } from "vuex";
import { initMock, getMock } from "./../mock";
import flow from "@front/components/danmakuFlow/index.vue";
import cloneDeep from "lodash/cloneDeep";
import random from "lodash/random";
import { toANY } from "@front/util_function/type";
import { rank } from "@front/datas/room";
import { settings, commonSettings } from "@/electron_browser/datas/aboutDanmaku";
import { settingBlocks } from "./settingBlocks";
import { Filter } from "@front/components/danmakuFlow/utils/common";
import { ElMessage } from "element-plus";
export default defineComponent({
	name: "danmakuSetting",
	components: { flow },
	data() {
		return {
			mockTimer: toANY(null),
			mockData: initMock(),
			settingBlocks: settingBlocks().map(i => markRaw(i)),
			brightness: 50,
			settingTarget: "toolBox",
			settings: settings(),
			commonSettings: commonSettings(),
			changeDialog: false,
			filter: new Filter()
		};
	},
	mounted() {
		this.getProfile(this.settingTarget);
		this.polling();
	},
	beforeUnmount() {
		clearTimeout(this.mockTimer);
	},
	computed: {
		...mapState(["danmakuSession", "rank", "danmakuProfile"]),
		tempRank(): any {
			return {
				...rank(),
				hasMedal: true,
				clubName: "ACER"
			};
		}
	},
	watch: {
		settingTarget: {
			handler(n, o) {
				this.getProfile(n);
			}
		},
		settings: {
			handler() {
				this.resetFilter();
			},
			deep: true
		}
	},
	methods: {
		polling() {
			clearTimeout(this.mockTimer);
			this.mockData = this.filter.filterUpdate(
				[...getMock(random(0, 3))],
				this.mockData,
				this.settings,
				this.commonSettings,
				this.tempRank
			).list;
			this.$nextTick(() => {
				this.mockTimer = setTimeout(this.polling, random(0, 2) * 1000);
			});
		},
		resetFilter() {
			this.filter.giftList = [];
			this.filter.likeList = [];
			const newMock = [...this.mockData].map((mock: any) => {
				return { ...mock };
			});
			this.mockData = this.filter.filter(
				newMock,
				this.settings,
				this.commonSettings,
				this.tempRank
			).filtered;
		},
		getProfile(target: any) {
			this.settings = cloneDeep(this.danmakuProfile[target]);
			this.commonSettings =
				cloneDeep(this.$store.state.danmakuProfile.common) ||
				commonSettings();
		},
		save() {
			this.$store.commit("updateSettings", {
				settingType: this.settingTarget,
				setting: this.settings
			});
			ElMessage({
				message: "设置已保存",
				duration: 1500,
				type: "success",
				offset: 60
			});
		},
		saveSync() {
			const save = {
				...this.settings
			};
			delete save.settingOfType;
			Object.assign(this.danmakuProfile.toolBox, save);
			Object.assign(this.danmakuProfile.web, save);
			this.$store.commit("updateSettings", {});
			ElMessage({
				message: "设置已保存并同步",
				duration: 1500,
				type: "success",
				offset: 60
			});
		}
	}
});
</script>
<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
@import "@front/styles/backgrounds.scss";
.danmaku-setting {
	position: absolute;
	height: 100%;
	.danmaku-list-bg {
		width: 100%;
		position: relative;
		background-color: black;
		overflow: hidden;
		border: $--border-base;
		border-radius: $--border-radius-base;
		box-shadow: $--box-shadow-base;
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
	.danmaku-list {
		height: 350px !important;
		width: 100%;
	}

	.right-content {
		@include scrollbarDark();
		width: 55%;
		:deep .el-checkbox-button__inner {
			padding-left: 5px !important;
			padding-right: 5px !important;
		}
		:deep > div {
			width: 100% !important;
		}
		overflow-y: scroll;
	}
}
.disabled {
	color: $--color-text-secondary;
}
.list-add-btn {
	position: absolute;
	right: 0px;
	display: flex;
	.slider {
		display: flex;
		align-items: center;
		margin-top: -10px;
		margin-right: 20px;
	}
}
</style>
