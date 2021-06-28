<template>
	<div class="audience-list">
		<div class="head-list" style="width:100%;display:flex;">
			<div v-menu="userMenuList" @contextmenu="currentUser=user" class="user-item" v-for="user in header" :key="user.userInfo.userID">
				<div class="header" :style="{backgroundImage:`url(${user.userInfo.avatar})`}"></div>
				<div class="nickname">
					<title-scrolling :label="user.userInfo.nickname" />
				</div>
				<div class="gift">
					<span class="manager" v-if="user.isManager">房管</span><span class="self-coin" />{{user.displaySendAmount}}
				</div>
			</div>
			<div style="position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);" v-if="header.length==0">暂无观众数据</div>
		</div>
		<div class="hidden">
			<div class="remain-list">
				<div v-menu="userMenuList" @contextmenu="currentUser=user" class="user-item" v-for="user in remains" :key="user.userInfo.userID">
					<div style="display:flex;align-item:center">
						<div class="manager" v-if="user.isManager">房管</div>
						<div class="header" :style="{backgroundImage:`url(${user.userInfo.avatar})`}"></div>
						<div class="nickname">
							<title-scrolling :label="user.userInfo.nickname" />
						</div>
					</div>
					<div class="gift"><span class="self-coin" />{{user.displaySendAmount}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAudience } from "@front/api/room";
import menu from "@front/directives/menu";
import { menu as menuList } from "@front/components/danmakuFlow/utils/common";
export default defineComponent({
	name: "audienceList",
	directives: {
		menu: menu()
	},
	data() {
		const timeout: any = null;
		return {
			list: [],
			timeout,
			currentUser: null
		};
	},
	computed: {
		header(): Array<any> {
			return this.list.slice(0, 3);
		},
		remains(): Array<any> {
			return this.list.slice(3);
		},
		userMenuList(): Array<any> {
			if (!this.currentUser) {
				return [];
			}
			return menuList(
				{
					type: 1001,
					data: this.currentUser
				},
				this.$store
			);
		}
	},
	mounted() {
		this.getList();
		this.$store.commit("getManagerList");
	},
	beforeUnmount() {
		clearTimeout(this.timeout);
	},
	methods: {
		getList() {
			clearTimeout(this.timeout);
			getAudience(this.$store.state.roomProfile).then(res => {
				this.list = res.map((user: any) => {
					user.isManager = this.$store.state.managerList.find(
						(i: any) => {
							return i.userInfo.userID === user.userInfo.userID;
						}
					);
					return user;
				});
			});
			this.timeout = setTimeout(() => {
				this.getList();
			}, 10000);
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
.audience-list {
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
.manager {
	font-size: $--font-size-extra-small;
	color: white;
	border-radius: $--border-radius-small;
	background-color: $--color-primary;
	padding: 0px 5px;
}
.head-list .user-item {
	min-width: 90px;
	width: 30%;
	margin-right: 2%;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-grow: 0;
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
		color: $--color-warning;
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
			color: $--color-warning;
		}
	}
}
</style>
