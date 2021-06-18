<template>
	<div class="handleMoving" @mousedown="addMovingListener">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { win } from "@front/util_function/system";
export default defineComponent({
	name: "handleMoving",
	data() {
		const size: any = null;
		return {
			size
		};
	},
	methods: {
		addMovingListener(e: MouseEvent): void {
			const startX = e.screenX;
			const startY = e.screenY;
			const winPosition = win.getPosition();
			const setPosition = (evt: MouseEvent) => {
				if (!this.size) {
					this.size = {
						height: window.innerHeight,
						width: window.innerWidth
					};
				}
				win.setBounds({
					...this.size,
					x: winPosition[0] + (evt.screenX - startX),
					y: winPosition[1] + (evt.screenY - startY)
				});
			};
			window.addEventListener("mousemove", setPosition);
			window.addEventListener(
				"mouseup",
				() => {
					window.removeEventListener("mousemove", setPosition);
					this.size = null;
				},
				{
					once: true
				}
			);
		}
	}
});
</script>

<style scoped lang='scss'>
.handleMoving {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
