<template>
	<div id="shrink">
		<transition name="fade">
			<div class="unstreamable" v-if="streamStatus.step==='nostreamable'">
				{{common.unstreamable}}<br>
				<el-button size="mini" type="primary" @click="$store.dispatch('nostreamable')">点击重试</el-button>
			</div>
			<div class="unstreamable" v-else-if="!isStreaming">
				<el-button type="primary" :disabled="loading" class="logBtn" size="medium" @click="openStream">
					{{$route.name==="roomMgmt"?"确认开播":"点我开播"}}
				</el-button>
			</div>
			<div v-else class="shrinkPanel">
				<div class="avatar" :style="{backgroundImage:`url(${roomProfile.liveCover||'/imgs/common/noCover.jpg'})`}" />
				<div class="roomProfile">
					<title-scrolling :label="roomProfile.title" />
					<div class="roomStatus">
						<icon-counter class="counter" title="观众" icon="el-icon-user-solid" :num="roomStatus.watchingCount" />
						<icon-counter class="counter" title="点赞" icon="self-like" :num="thousandFormatter(roomStatus.statistic.likeCount)" />
						<icon-counter class="counter" title="香蕉" icon="self-banana" :num="thousandFormatter(roomStatus.statistic.bananaCount)" />
						<icon-counter class="counter" title="ac币" icon="self-coin" :num="thousandFormatter(roomStatus.statistic.diamondCount/100)" />
					</div>
					<div class="type">
						{{`${roomProfile.liveType.categoryName} - ${roomProfile.liveType.subCategoryName}    已播时长：${unixTimeFormatter($store.state.roomStatus.liveDuration)}`}}
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
import { mapState, mapGetters } from "vuex";
import { defineComponent } from "vue";
import flow from "@front/components/danmakuFlow/index.vue";
import { event } from "@front/util_function/eventBus";
import {
	unixTimeFormatter,
	thousandFormatter
} from "@front/util_function/formatter";
import { common } from "@front/texts";
export default defineComponent({
	name: "shrink",
	components: {
		flow
	},
	data() {
		return {
			loading: false
		};
	},
	computed: {
		...mapState(["roomProfile", "streamStatus", "roomStatus"]),
		...mapGetters(["isStreaming"]),
		common
	},
	methods: {
		unixTimeFormatter,
		thousandFormatter,
		openStream() {
			if (this.$route.name !== "roomMgmt") {
				this.$router.push({
					path: "/roomMgmt"
				});
			} else {
				event.emit("openStream");
				this.loading = true;
				event.once("openStreamEnd", () => {
					this.loading = false;
				});
			}
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
#shrink {
	position: absolute;
	top: 0px;
	width: 100%;
	height: 70px;
	.unstreamable {
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255);
		color: $--color-text-secondary;
		user-select: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		white-space: pre;
		text-align: center;
		transition: all 0.25s;
		&:hover {
			color: $--color-text-primary;
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
			border-radius: $--border-radius-base;
			background-size: auto 100%;
			background-repeat: no-repeat;
			box-shadow: $--box-shadow-base;
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
			color: $--color-text-secondary;
			user-select: none;
			.roomStatus {
				display: flex;
				align-items: center;
				font-size: $--font-size-extra-small;
			}
			.type {
				font-size: $--font-size-extra-small;
			}
		}
	}
}
</style>
