<template>
	<div class="danmaku-row" v-if="!configMode">
		<component :is="templateComponent" :danmaku="danmaku" :key="key" />
	</div>
	<div class="danmaku-row" v-else></div>
</template>

<script>
import { defineComponent, createApp } from "vue/dist/vue.esm-bundler.js";
import advFunctions from "./advanceFunctions";
import { getDanmakuType } from "@front/components/danmakuFlow/utils/getter";
export default defineComponent({
	name: "danmakuRow",
	props: {
		setting: {
			required: true
		},
		danmaku: {
			required: true
		},
		configMode: {
			default: false
		}
	},
	data() {
		return {
			key: 1
		};
	},
	mounted() {
		this.handleChanges();
	},
	computed: {
		watcher() {
			return [this.setting, this.danmaku];
		},
		templateComponent() {
			if (this.configMode) return {};
			const { advHtml, advCss } = this.setting;
			const comp = defineComponent({
				template: advHtml,
				props: ["danmaku"],
				methods: {
					...advFunctions
				}
			});
			const newStyleId = `danmaku-${getDanmakuType(this.danmaku)}-${
				this.setting.advId
			}`;
			if (!document.querySelector(`#${newStyleId}`)) {
				document
					.querySelector(
						`style[id*="#danmaku-${getDanmakuType(this.danmaku)}-"]`
					)
					?.remove();

				const css = document.createElement("style");
				css.id = newStyleId;
				css.innerText = advCss;
				document.body.appendChild(css);
			}
			return comp;
		}
	},
	watch: {
		watcher: {
			handler(n, o) {
				if (!this.configMode) return;
				this.handleChanges(n, o);
			},
			deep: true
		}
	},
	methods: {
		handleChanges(n, o) {
			if (!this.configMode) return;
			n = this.setting;
			if (!n?.advHtml || !this.$el) return;
			this.$el.innerHTML = "";
			const danmaku = this.danmaku;
			const { advHtml, advCss } = this.setting;
			const css = document.createElement("style");
			css.innerText = advCss;
			this.$el.appendChild(css);
			const comp = defineComponent({
				data() {
					return { danmaku };
				},
				methods: { ...advFunctions },
				template: advHtml
			});
			const div = document.createElement("div");
			this.$el.appendChild(div);
			try {
				createApp(comp).mount(div);
			} catch (error) {
				console.log(error);
				div.innerHTML = "编译出错，请检查代码";
			}
		}
	}
});
</script>

<style scoped lang="scss">
.danmaku-row {
	&.config {
		min-width: 300px;
	}
	width: 100%;
	box-sizing: border-box;
	word-break: break-all;
	word-wrap: break-word;
	position: relative;
	.combo {
		display: inline-block;
		vertical-align: middle;
		color: white;
		background-color: rgb(67, 136, 214);
		padding: 2px 4px;
		border-radius: 8px;
		animation: scale 0.25s forwards;
		margin: 6px;
	}
	@keyframes scale {
		0% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}

	// &.is-liver {
	// 	width: calc(100% - 16px) !important;
	// 	padding-left: 8px !important;
	// 	padding-right: 8px !important;
	// 	padding-top: 8px !important;
	// 	padding-bottom: 24px !important;
	// 	border-radius: 4px !important;
	// 	background-color: rgb(0, 170, 255) !important;
	// 	&::after {
	// 		content: "主播发言";
	// 		color: white;
	// 		position: absolute;
	// 		left: 12px;
	// 		bottom: 4px;
	// 		font-size: 12px !important;
	// 	}
	// }
}
</style>
