<template>
	<transition name="listAni" appear>
		<div ref="menu" style="position:fixed;z-Index:4000" :style="{left:`${position.x}px!important`,top:`${position.y}px!important`}">
			<right-click-menu-list ref="menuList" @close="close()" :list="list" />
		</div>
	</transition>
</template>

<script >
import rightClickMenuList from "./rightClickMenuList.vue";
import { event } from "@front/util_function/eventBus";
import { render, defineComponent } from "vue";
export default defineComponent({
	name: "rightClickMenu",
	components: {
		rightClickMenuList
	},
	props: {
		element: {
			required: true
		},
		list: {
			default: () => {
				return [];
			}
		},
		position: {
			default: () => {
				return {
					x: 0,
					y: 0
				};
			}
		}
	},
	mounted() {
		this.addBlurListener();
	},
	methods: {
		close() {
			event.off("mouseclick", this.judgeBlur);
			render(null, this.$el);
			// @ts-ignore
			this.element.remove();
		},
		addBlurListener() {
			document.addEventListener("mousedown", e => {
				this.judgeBlur(e);
			});
			window.addEventListener("resize", e => {
				this.judgeBlur(e);
			});
		},
		judgeBlur(e) {
			for (const item of e.path) {
				if (item === this.$refs.menu) {
					return;
				}
			}
			document.removeEventListener("mousedown", e => {
				this.judgeBlur(e);
			});
			window.removeEventListener("resize", e => {
				this.judgeBlur(e);
			});
			this.close();
		}
	}
});
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
