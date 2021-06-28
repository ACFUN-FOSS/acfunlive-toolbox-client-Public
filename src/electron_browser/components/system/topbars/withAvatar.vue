<template>
	<div id="topbar">
		<div class="handler">
			<handler-moving />
		</div>

		<div class="avatar">
			<el-avatar size="small" :src="$store.state.userProfile.avatar" />
			<span class="username">{{$store.state.userProfile.nickname}}</span>
		</div>
		<el-dropdown placement="bottom-start" size="mini">
			<div class="buttonIcon"><span class="el-icon-menu" /></div>
			<template #dropdown>
				<el-dropdown-menu class="menu">
					<el-dropdown-item class="item" @click="logout()">
						切换账号{{$store.state.streaming?" （建议先结束直播）":''}}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>

		<div class="buttonIcon divider">
			<el-divider direction="vertical" />
		</div>
		<handler-window />
	</div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { logout } from "@front/util_function/login";
const HandlerMoving = defineAsyncComponent(() =>
	import("@front/components/system/HandlerMoving.vue")
);
const HandlerWindow = defineAsyncComponent(() =>
	import("@front/components/system/HandlerWindow.vue")
);
export default defineComponent({
	name: "topbarAvatar",
	components: {
		HandlerMoving,
		HandlerWindow
	},
	methods: {
		logout() {
			logout();
		}
	}
});
</script>
<style scoped lang='scss'>
@import "@front/styles/variables.scss";
#topbar {
	width: calc(100% - 50px);
	height: 50px;
	display: flex;
	position: relative;
	border-bottom: 1px solid $--color-text-placeholder;
	margin: 0px 25px;
	user-select: none;
	.handler {
		position: relative;
		color: white;
		flex-grow: 1;
	}
	.avatar {
		height: 100%;
		display: flex;
		align-items: center;
		font-size: $--font-size-small;
		color: $--color-text-secondary;
		.username {
			padding: 0px 8px 0px 4px;
		}
	}
}
.menu {
	margin: 0px;
	border: none;
	.item {
		white-space: nowrap;
	}
}
</style>
