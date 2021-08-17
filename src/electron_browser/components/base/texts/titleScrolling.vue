<template>
	<div ref="title" class="title" :style="style">
		<div>{{label}}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "titleScrolling",
	props: {
		label: {
			type: String,
			default: ""
		}
	},
	data() {
		const observer: any = null;
		const observerTimer: any = null;
		return {
			titleMove: 0,
			observer,
			observerTimer,
			mounted: false
		};
	},
	computed: {
		style(): any {
			return {
				"--titleMove": `${this.titleMove}px`,
				"--titleMoveTime": `${-this.titleMove / 4}s`
			};
		}
	},
	watch: {
		label: {
			handler(n, o) {
				if (this.mounted && n) {
					this.addObserver();
				}
			},
			immediate: true
		}
	},
	mounted() {
		this.addObserver();
	},
	beforeUnmount() {
		if (this.observer) {
			this.observer.disconnect();
		}
	},
	methods: {
		addObserver() {
			try {
				const parent: any = this.$el;
				if (!parent) {
					throw new Error();
				}
				const child = parent.firstChild;
				const getMove = () => {
					const move = child.offsetWidth - parent.offsetWidth;
					if (move > 0) {
						this.titleMove = -move - 10;
					} else {
						this.titleMove = 0;
					}
				};
				if (this.observer) {
					this.observer.disconnect();
				}
				// @ts-ignore
				this.observer = new ResizeObserver(getMove);

				this.observer.observe(parent);
				this.observer.observe(child);
				getMove();
			} catch (error) {}
		}
	}
});
</script>
<style scoped lang='scss'>
@import "@front/styles/variables.scss";
.title {
	position: relative;
	font-size: $--font-size-base;
	color: $--color-text-primary;
	overflow: hidden;
	& > div {
		animation: moveText var(--titleMoveTime) linear 1s infinite alternate;
		width: fit-content;
		&:hover {
			animation-play-state: paused;
		}
	}
}
@keyframes moveText {
	0%,
	20% {
		transform: translateX(0%);
	}
	80%,
	100% {
		transform: translateX(var(--titleMove));
	}
}
</style>
