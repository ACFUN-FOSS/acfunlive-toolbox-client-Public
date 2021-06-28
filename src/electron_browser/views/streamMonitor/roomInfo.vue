<template>
	<div id="roomInfo">
		<div class="liveCover" :style="{backgroundImage:`url(${roomProfile.liveCover||'/imgs/common/noCover.jpg'})`}" />
		<div class="roomStatus">
			<title-scrolling class="title" :label="roomProfile.title" />
			<div class="middle">
				<div class="subtitles">
					<div class="subtitle">{{`${roomProfile.liveType.categoryName} - ${roomProfile.liveType.subCategoryName}`}}
					</div>
					<div class="subtitle"> 已播时长：{{unixTimeFormatter($store.state.roomStatus.liveDuration)}}</div>
				</div>
			</div>
			<div class="counters">
				<icon-counter class="counter" title="观众" icon="el-icon-user-solid" :num="roomStatus.watchingCount" />
				<icon-counter class="counter" title="点赞" icon="self-like" :num="thousandFormatter(roomStatus.statistic.likeCount)" />
				<icon-counter class="counter" title="香蕉" icon="self-banana" :num="thousandFormatter(roomStatus.statistic.bananaCount)" />
				<icon-counter class="counter" title="ac币" icon="self-coin" :num="thousandFormatter(roomStatus.statistic.diamondCount/100)" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import {
	unixTimeFormatter,
	thousandFormatter
} from "@front/util_function/formatter";
export default defineComponent({
	name: "roomInfo",
	data() {
		return {};
	},
	computed: {
		...mapState(["roomProfile", "roomStatus", "userSession"])
	},
	watch: {},
	methods: {
		unixTimeFormatter,
		thousandFormatter
	}
});
</script>
<style scoped lang='scss'>
@import "@front/styles/variables.scss";
#roomInfo {
	display: flex;
	& > div {
		flex-shrink: 0;
	}
	.liveCover {
		width: 100px;
		height: 100px;
		margin-right: 16px;
		background-size: cover;
		background-position: center;
		border-radius: 4px;
	}
	.roomStatus {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: space-between;
		flex-grow: 1;
		& > div {
			flex-shrink: 0;
		}
		.middle {
			display: flex;
			flex-grow: 1;
			justify-content: space-between;
			position: relative;
			.btns {
				display: flex;
				align-items: center;
			}
		}
		.subtitles {
			height: 60px;
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
		}
		.title {
			width: 210px;
			white-space: nowrap;
			overflow: hidden;
			font-size: $--font-size-medium;
		}
		.subtitle,
		.counter {
			color: $--color-text-secondary;
			font-size: $--font-size-extra-small;
		}

		.counters {
			display: flex;
			flex-wrap: no-wrap;
			justify-content: space-between;

			.counter {
				font-size: $--font-size-base !important;
			}
		}
	}
}
</style>
