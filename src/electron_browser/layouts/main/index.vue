<template>
	<div id="home">
		<sidebar-base />
		<div class="right">
			<topbar-avatar />
			<div class="content">
				<div class="view" v-if="!minify">
					<title-frame :title="$route.meta.label">
						<router-view v-slot="{ Component }">
							<transition name="fade" mode="out-in">
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
import statusBar from "@front/components/statusBar/index.vue";
import topbarAvatar from "@front/components/system/topbars/withAvatar";
import { mapState } from "vuex";
export default defineComponent({
	name: "home",
	components: {
		statusBar,
		topbarAvatar
	},
	mounted() {
		this.$store.state.isLogined = true;
	},
	computed: {
		...mapState(["minify"])
	}
});
</script>

<style scoped lang="scss">
@import "@front/styles/variables.scss";
#home {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	height: 100%;
	font-size: $--font-size-base;
	box-shadow: $--box-shadow-dark;
	position: absolute;
	background-color: $--background-color-base;
	transition: all 0.5s;
	left: 0px;
	top: 0px;
	border-radius: $--border-radius-small;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	.right {
		// background-color: $--background-color-base;
		width: calc(100% - 210px);
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
