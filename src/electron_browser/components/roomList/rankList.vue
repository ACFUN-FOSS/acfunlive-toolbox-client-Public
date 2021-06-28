<template>
	<div class="rank-list">
		<div class="head-list" style="width:100%;display:flex;">
			<div class="user-item" v-for="user in header" :key="user.profile.userID">
				<div class="header" :style="{backgroundImage:`url(${user.profile.avatar})`}"></div>
				<div class="nickname">
					<title-scrolling :label="user.profile.nickname" />
				</div>
				<div class="gift">
					<span class="self-like" />{{user.friendshipDegree}}
				</div>
			</div>
			<div style="position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);" v-if="header.length==0">暂无守护榜数据</div>
		</div>
		<div class="hidden">
			<div class="remain-list">
				<div class="user-item" v-for="user in remains" :key="user.profile.userID">
					<div style="display:flex;align-item:center">
						<div class="header" :style="{backgroundImage:`url(${user.profile.avatar})`}"></div>
						<div class="nickname">
							<title-scrolling :label="user.profile.nickname" />
						</div>
					</div>
					<div class="gift"><span class="self-like" />{{user.friendshipDegree}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
export default defineComponent({
	name: "rankList",
	data() {
		const timeout: any = null;
		return {
			timeout,
			currentUser: null
		};
	},
	computed: {
		...mapState(["rank"]),
		rankList(): Array<any> {
			return this.rank.rankList;
		},
		header(): Array<any> {
			return this.rankList.slice(0, 3);
		},
		remains(): Array<any> {
			return this.rankList.slice(3);
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
.rank-list {
	width: calc(100% + 16px);
	.hidden {
		max-height: 0px;
		transition: max-height 0.25s;
		overflow: hidden;
		width: 100%;
	}
	&:hover .hidden {
		max-height: 400px;
	}
}
.head-list .user-item {
	min-width: 90px;
	width: 30%;
	margin-right: 2%;
	display: flex;
	flex-direction: column;
	flex-grow: 0;
	align-items: center;
	.header {
		height: 45px;
		width: 45px;
		background-size: contain;
		border-radius: 50%;
		border: $--border-base;
		box-shadow: $--box-shadow-dark;
	}
	.nickname {
		width: 100%;
		text-align: center;
		overflow: hidden;
		& > div {
			max-width: 100%;
			display: inline-block;
			white-space: nowrap;
			overflow: hidden;
			font-size: $--font-size-extra-small;
		}
	}
	.gift {
		color: $--color-primary;
		display: flex;
		align-items: center;
	}
}
.remain-list {
	box-sizing: border-box;
	width: 100%;
	background-color: $--background-color-base;
	overflow-y: scroll;
	@include scrollbarDark();
	max-height: 400px;

	.user-item {
		box-sizing: border-box;
		width: 100%;
		display: flex;
		justify-content: space-between;
		&:hover {
			background-color: rgba(0, 0, 0, 0.1);
		}
		padding: 2.5px 5px;
		& > div {
			flex-grow: 0;
			flex-shrink: 0;
		}
		.header {
			height: 15px;
			width: 15px;
			background-size: contain;
			border-radius: 50%;
			border: $--border-base;
			margin-right: 5px;
		}

		.nickname {
			max-width: 270px;
			text-align: center;
			overflow: hidden;
			& > div {
				max-width: 100%;
				display: inline-block;
				white-space: nowrap;
				overflow: hidden;
				font-size: $--font-size-extra-small;
			}
		}
		.gift {
			color: $--color-primary;
		}
	}
}
</style>
