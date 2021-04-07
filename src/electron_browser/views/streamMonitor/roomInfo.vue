<template>
	<div id="roomInfo">
		<div class="liveCover" :style="{backgroundImage:`url(${roomProfile.liveCover||'/imgs/common/noCover.jpg'})`}" />
		<div class="roomStatus">
			<title-scrolling class="title" :label="roomProfile.title" />
			<div class="middle">
				<div class="subtitles">
					<div class="subtitle">{{`${roomProfile.liveType.categoryName} - ${roomProfile.liveType.subCategoryName}`}}
					</div>
					<div class="subtitle"> 已播时长：{{$SM.unixTimeFormatter($store.state.roomStatus.liveDuration)}}</div>
				</div>
				<div class="btns">
					<el-button size="mini" class="btn" @click="closeStream">下播</el-button>
				</div>
			</div>
			<div class="counters">
				<icon-counter class="counter" title="观众" icon="el-icon-user-solid"
					:num="checkNumber(roomStatus.watchingCount)" />
				<icon-counter class="counter" title="点赞" icon="self-like" :num="checkNumber(roomStatus.likeCount)" />
				<icon-counter class="counter" title="香蕉" icon="self-banana" :num="checkNumber(roomStatus.bananaCount)" />
				<icon-counter class="counter" title="ac币" icon="self-coin" :num="checkNumber(roomStatus.bananaCount)" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { closeStream } from "@fe/mixins/methods";
export default defineComponent({
	name: "roomInfo",
	mixins: [closeStream],
	data() {
		return {};
	},
	computed: {
		...mapState(["roomProfile", "roomStatus"])
	},
	watch: {},
	methods: {
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
@import "@fe/assets/scss/base.scss";
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
			.btns {
				display: flex;
				align-items: center;
				.btn {
					@include buttonBase(
						var(--generalStyle_color_primary),
						var(--generalStyle_color_primary_EL),
						white
					);
				}
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
			font-size: var(--generalStyle_fontSize_M);
		}
		.subtitle,
		.counter {
			color: var(--generalStyle_fontColor_Second);
			font-size: var(--generalStyle_fontSize_ES);
		}

		.counters {
			display: flex;
			flex-wrap: no-wrap;
			justify-content: space-between;

			.counter {
				font-size: var(--generalStyle_fontSize_B) !important;
			}
		}
	}
}
</style>
