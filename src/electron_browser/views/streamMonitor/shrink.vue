<template>
	<div id="shrink">
		<transition name="fade">
			<div class="unstreamable" v-if="!streamStatus.avaliable">
				{{generalConfig.unstreamable}}
			</div>
			<div class="unstreamable" v-else-if="!streamStatus.underway">
				<el-button class="logBtn" size="medium" @click="openStream">{{$route.name==="roomMgmt"?"确认开播":"点我开播"}}
				</el-button>
			</div>
			<div v-else class="shrinkPanel">
				<div class="avatar" :style="{backgroundImage:`url(${roomProfile.liveCover||'/imgs/common/noCover.jpg'})`}" />
				<div class="roomProfile">
					<title-scrolling :label="roomProfile.title" />
					<div class="roomStatus">
						<icon-counter title="观众" icon="el-icon-user-solid" :num="checkNumber(roomStatus.watchingCount)" />
						<icon-counter title="点赞" icon="self-like" :num="checkNumber(roomStatus.likeCount)" />
						<icon-counter title="香蕉" icon="self-banana" :num="checkNumber(roomStatus.bananaCount)" />
						<icon-counter title="ac币" icon="self-coin" :num="checkNumber(roomStatus.bananaCount)" />
					</div>
					<div class="type">
						{{`${roomProfile.liveType.categoryName} - ${roomProfile.liveType.subCategoryName}    已播时长：${$SM.unixTimeFormatter($store.state.roomStatus.liveDuration)}`}}
					</div>
				</div>
				<div class="flow">
					<flow style="font-size:14px" :max="1" />
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import { defineComponent } from "vue";
import flow from "@fe/components/danmakuSelf/flow/index.vue";
export default defineComponent({
	name: "shrink",
	components: {
		flow
	},
	computed: {
		...mapState([
			"roomProfile",
			"generalConfig",
			"streamStatus",
			"roomStatus"
		])
	},
	methods: {
		openStream() {
			if (this.$route.name !== "roomMgmt") {
				this.$router.push({
					path: "/roomMgmt"
				});
			} else {
				this.$Event.emit("openStream");
			}
		},
		checkNumber(num: string): string | number {
			if (num.indexOf("万")) {
				return num;
			}
			return parseInt(num);
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@fe/assets/scss/base";
#shrink {
	position: absolute;
	top: 0px;
	width: 100%;
	height: 70px;
	.unstreamable {
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255);
		color: var(--generalStyle_fontColor_Second);
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: pre;
		text-align: center;
		transition: all 0.25s;
		&:hover {
			color: var(--generalStyle_fontColor_First);
		}
		.logBtn {
			@include buttonBase(
				var(--generalStyle_color_primary),
				var(--generalStyle_color_primary_EL),
				white
			);
		}
	}
	.shrinkPanel {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		padding: 8px 30px;
		display: flex;
		& > div {
			flex-shrink: 0;
		}
		.avatar {
			height: 54px;
			width: 54px;
			border-radius: var(--generalStyle_radius_large);
			background-size: auto 100%;
			background-repeat: no-repeat;
			box-shadow: var(--generalStyle_shadow_base);
			background-position: center;
		}
		.roomProfile {
			display: flex;
			position: relative;
			width: 250px;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 16px;
			white-space: pre;
			color: var(--generalStyle_fontColor_Second);
			user-select: none;
			.roomStatus {
				display: flex;
				align-items: center;
				font-size: var(--generalStyle_fontSize_ES);
			}
			.type {
				font-size: var(--generalStyle_fontSize_ES);
			}
		}
	}
}
</style>
