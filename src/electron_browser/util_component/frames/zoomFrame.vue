<template>
	<div class="zoomFrame" :style="styles">
		<div class="zoomContent" :style="dynamic">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "frame",
	props: {
		allowZoom: {
			default: true
		},
		zoomMax: {
			default: 1000
		},
		styles: {
			default: {}
		}
	},
	data() {
		const parentResizeListener: any = null;
		const childResizeListener: any = null;
		return {
			parentResizeListener,
			childResizeListener,
			parentWidth: 100,
			parentHeight: 100,
			childWidth: 100,
			childHeight: 100
		};
	},
	mounted() {
		const child = this.$el.firstChild;
		const parent = this.$el;
		this.getActualWidth(parent, child);
		// @ts-ignore
		this.childResizeListener = new ResizeObserver(() => {
			this.getActualWidth(parent, child);
		}).observe(child);
		// @ts-ignore
		this.parentResizeListener = new ResizeObserver(() => {
			this.getActualWidth(parent, child);
		}).observe(parent);
	},
	computed: {
		dynamic(): any {
			if (this.allowZoom) {
				const xZoom = this.childWidth / this.parentWidth;
				const yZoom = this.childHeight / this.parentHeight;
				let zoom = 0.9 / Math.max(xZoom, yZoom);
				// console.log(zoom)
				if (zoom > this.zoomMax) {
					zoom = this.zoomMax;
				}
				return {
					transform: `translateX(-50%) translateY(-50%) scaleX(${zoom}) scaleY(${zoom})`
				};
			} else {
				return {
					transform:
						"translateX(-50%) translateY(-50%) scaleX(1) scaleY(1)"
				};
			}
		}
	},
	methods: {
		getActualWidth(parent: any, child: any) {
			this.parentWidth = parent.getBoundingClientRect().width;
			this.parentHeight = parent.getBoundingClientRect().height;
			this.childWidth = child.offsetWidth;
			this.childHeight = child.offsetHeight;
		}
	}
});
</script>

<style scoped lang="scss">
.zoomFrame {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	.zoomContent {
		position: absolute;
		transition: all 0.15s;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
	}
}
</style>
