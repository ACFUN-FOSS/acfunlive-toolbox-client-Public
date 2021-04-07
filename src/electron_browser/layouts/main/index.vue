<template>
	<div id="home">
		<sidebar-base />
		<div class="right">
			<topbar-avatar />
			<div class="content">
				<div class="view">
					<title-frame :title="$route.meta.label">
						<router-view v-slot="{ Component }">
							<transition name="fade_transform" mode="out-in">
								<component :is="Component" />
							</transition>
						</router-view>
					</title-frame>
				</div>
				<status-bar />
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import statusBar from "@fe/components/statusBar/index.vue";
import topbarAvatar from "@fe/components/system/topbars/withAvatar";
export default defineComponent({
	name: "home",
	components: {
		statusBar,
		topbarAvatar
	},
	data() {
		return {};
	},
	mounted() {
		this.$store.state.isLogined = true;
	}
});
</script>

<style scoped lang="scss">
#home {
	position: absolute;
	height: 100%;
	width: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	.right {
		// background-color: var(--generalStyle_color_background);
		flex-grow: 1;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		& > div {
			flex-shrink: 0;
		}
		.content {
			position: relative;
			width: 100%;
			flex-grow: 1;
			.view {
				height: calc(100% - 70px);
			}
		}
	}
}
</style>
