<template>
	<div class="dynamicFrame" :style="dynamic">
		<slot></slot>
	</div>
</template>

<script>
// used to keep content in fix ratio
export default {
	name: "frame",
	props: {
		ratio: {
			default: () => {
				return 16 / 9;
			}
		},
		by: {
			default: "height"
		}
	},
	data() {
		return {
			resizeListener: null,
			width: 100,
			height: 100
		};
	},
	mounted() {
		let parient;
		if ((parient = this.$parent.$el)) {
			this.getActualWidth(parient);
			this.resizeListener = new ResizeObserver(() => {
				this.getActualWidth(parient);
			}).observe(this.$parent.$el);
		}
	},
	beforeDestroy() {
		if (this.resizeListener) {
			this.resizeListener.disconnect();
			this.resizeListener = null;
		}
	},
	computed: {
		dynamic() {
			if (this.by == "auto") {
				if (this.width / this.height >= this.ratio) {
					return {
						width: `${this.height * this.ratio}px`,
						height: `${this.height}px`
					};
				}
				return {
					width: `${this.width}px`,
					height: `${this.width / this.ratio}px`
				};
			}
			if (this.by == "contain") {
				if (this.width / this.height >= this.ratio) {
					return {
						width: `${this.width}px`,
						height: `${this.width / this.ratio}px`
					};
				}
				return {
					width: `${this.height * this.ratio}px`,
					height: `${this.height}px`
				};
			}
			if (this.by == "height") {
				return {
					width: `${this.height * this.ratio}px`,
					height: `${this.height}px`
				};
			}
			return {
				width: `${this.width}px`,
				height: `${this.width / this.ratio}px`
			};
		}
	},
	methods: {
		getActualWidth(el) {
			this.width = el.getBoundingClientRect().width;
			this.height = el.getBoundingClientRect().height;
		}
	}
};
</script>

<style scoped lang='scss'>
.dynamicFrame {
	position: relative;
	flex-shrink: 0;
}
</style>
