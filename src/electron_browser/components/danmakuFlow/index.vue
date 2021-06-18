<template>
	<div class="danmaku-flow" @mousemove="leaveScroll" @mousewheel="scrollable=true;" @mouseleave="scrollable=false">
		<transition-group name="fade">
			<danmaku-row v-menu="list" @contextmenu="currentRow = danmaku" v-for="danmaku in [...danmakuLists].reverse()" :key="getKey(danmaku)" :danmaku="danmaku" :setting="getSetting(danmaku)" />
		</transition-group>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import danmakuRow from "./danmakuRow.vue";
import { styleConfig } from "@front/components/danmakuFlow/utils/data";
import { getTime } from "@front/components/danmakuFlow/utils/getter";
import menu from "@front/directives/menu";
import { menu as menuList } from "@front/components/danmakuFlow/utils/common";
import { throttle } from "lodash";
import { event } from "@front/util_function/eventBus";
export default defineComponent({
	name: "flow",
	components: { danmakuRow },
	props: {
		danmakuList: {
			default: () => {
				return [];
			}
		},
		settings: {
			required: true
		},
		configMode: {
			default: false
		}
	},
	directives: {
		menu: menu()
	},
	data() {
		const scrollObserver: any = undefined;
		const scrollTimer: any = null;
		return {
			scrollObserver,
			scrollTimer,
			scrollable: false,
			currentRow: null
		};
	},
	computed: {
		danmakuLists(): Array<any> {
			return this.danmakuList;
		},
		list(): Array<any> {
			if (this.configMode) {
				return [];
			}
			return menuList(this.currentRow, this.$store);
		}
	},
	mounted() {
		this.scrollObserver = new MutationObserver(this.scrollToBottom);
		this.scrollObserver.observe(this.$el, {
			childList: true,
			subtree: true
		});
		this.scrollToBottom();
		event.on("minify", this.scrollToBottom);
	},
	beforeUnmount() {
		this.scrollObserver.disconnect();
		event.off("minify", this.scrollToBottom);
	},
	methods: {
		getKey(danmaku: any) {
			return getTime(danmaku);
		},
		scrollToBottom: throttle(function() {
			// @ts-ignore
			const that = this;

			if (!that.scrollable) {
				clearTimeout(that.scrollTimer);
				that.$nextTick(() => {
					that.$el.scrollTo({
						top: that.$el.scrollHeight - that.$el.clientHeight,
						behavior: "smooth"
					});
				});
			}
		}, 500),
		getSetting(danmaku: any) {
			// @ts-ignore
			const setting = this.settings?.settingOfType[danmaku.type];
			if (setting) {
				return setting;
			}
			return styleConfig(danmaku.type);
		},
		leaveScroll() {
			if (!this.scrollable) {
				return;
			}
			clearTimeout(this.scrollTimer);
			this.scrollTimer = setTimeout(() => {
				this.scrollable = false;
				this.scrollToBottom();
			}, 2000);
		}
	}
});
</script>
<style scoped lang='scss'>
@import "@front/styles/index.scss";
.danmaku-flow {
	box-sizing: border-box;
	position: relative;
	width: calc(100% - 12px);
	height: calc(100% - 32px);
	overflow-x: hidden;
	overflow-y: auto;
	padding: 16px 6px;
	transform: translateZ(1);
	@include scrollbarBaseSlinder();
	// & > div {
	// 	display: flex;
	// 	flex-direction: column;
	// 	align-content: stretch;
	// }
}
</style>
