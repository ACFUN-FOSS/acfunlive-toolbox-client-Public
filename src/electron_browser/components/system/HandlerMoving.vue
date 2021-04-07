<template>
	<div class="handleMoving" @mousedown="addMovingListener">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SysMethods } from "@fe/api/sysMethods";
export default defineComponent({
	name: "handleMoving",
	data() {
		return {
			sy: new SysMethods()
		};
	},
	methods: {
		addMovingListener(e: MouseEvent): void {
			const startX = e.screenX;
			const startY = e.screenY;
			const winPosition = this.sy.win.getPosition();
			const setPosition = (evt: MouseEvent) => {
				this.sy.win.setPosition(
					winPosition[0] + (evt.screenX - startX),
					winPosition[1] + (evt.screenY - startY)
				);
			};
			window.addEventListener("mousemove", setPosition);
			window.addEventListener(
				"mouseup",
				() => {
					window.removeEventListener("mousemove", setPosition);
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
