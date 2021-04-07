<template>
	<div :class="{config:config}" id="danmakuList" @mouseenter="scrollable = true" @mouseleave="scrollable = false">
		<transition-group tag="div" name="fade_transform">
			<div class="danmakuRow" :class="danmakuSettings[danmaku.type].name"
				v-for="danmaku in max?danmakuList.slice(0,max).reverse():danmakuList.slice().reverse()" :key="danmaku">
				<component v-for="(widgetName,index) in danmakuSettings[danmaku.type].widgets" :is="widgets[widgetName]"
					:key="index" :danmaku="danmaku" />
				<div class="extra">{{danmakuSettings[danmaku.type].info}}</div>
			</div>
		</transition-group>
	</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, markRaw } from "vue";
import { mapGetters } from "vuex";
import $ from "jquery";
import timestamp from "./widgets/timestamp.vue";
import medal from "./widgets/medal.vue";
import avatar from "./widgets/avatar.vue";
import nickName from "./widgets/nickName.vue";
import contentText from "./widgets/content.vue";
export default defineComponent({
	name: "flow",
	props: {
		config: {
			default: false
		},
		max: {
			default: 0
		}
	},
	data() {
		const scrolTimeout: any = undefined;
		return {
			scrolTimeout,
			scrollable: false,
			widgets: {
				timestamp: markRaw(timestamp),
				medal: markRaw(medal),
				avatar: markRaw(avatar),
				nickName: markRaw(nickName),
				contentText: markRaw(contentText)
			},
			danmakuSettings: {
				1000: {
					name: "text",
					widgets: [
						"timestamp",
						"medal",
						"avatar",
						"nickName",
						"contentText"
					],
					info: ""
				},
				1001: {
					name: "like",
					widgets: ["timestamp", "nickName"],
					info: "点亮了爱心"
				},
				1002: {
					name: "enter",
					widgets: ["timestamp", "medal", "avatar", "nickName"],
					info: "进入直播间"
				},
				1003: {
					name: "subscribe",
					widgets: ["timestamp", "medal", "avatar", "nickName"],
					info: "关注了主播"
				},
				1005: {
					name: "subscribe",
					widgets: ["timestamp", "medal", "avatar", "nickName"],
					info: "送礼"
				},
				1007: {
					name: "subscribe",
					widgets: ["timestamp", "medal", "avatar", "nickName"],
					info: "办牌子"
				}
			}
		};
	},
	computed: {
		...mapGetters(["danmakuList"])
	},
	mounted() {
		this.scrollToBottom();
	},
	beforeUnmount() {
		clearTimeout(this.scrolTimeout);
	},
	methods: {
		scrollToBottom() {
			if (!this.scrollable) {
				const list = document.querySelector("#danmakuList>div");
				if (!list) {
					return;
				}
				$("#danmakuList").animate(
					{
						scrollTop: list.getBoundingClientRect().height
					},
					"slow"
				);
			}
			clearTimeout(this.scrolTimeout);
			this.scrolTimeout = setTimeout(() => {
				this.scrollToBottom();
			}, 1000);
		}
	}
});
</script>
<style scoped lang='scss'>
@import "@fe/assets/scss/animation.scss";
#danmakuList {
	width: 100%;
	height: 100%;
	overflow-x: 0px;
	overflow-y: auto;
	&::-webkit-scrollbar {
		width: 0px;
	}
	&.config {
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAoUlEQVRIie3VsQqDMBRG4RPvHVKoD1AH3/9tnDO6tHstGjAhHUrnXAeHlvzz4SOEiG6apjtwpbIYI8MwMI5jLf3upcDNWh9c3wHLSfjSnQQD0PCG26cxRlO4risppUO4m+f5CfS1cN/3z2lUbbBzyZVSTDhACIFt20w4HLxz7725FZHyu6+l4X+Imz4ggJyzGc45OwUeGP7+AKp6ERExtuUNG1ItJEtarRwAAAAASUVORK5CYII=);
	}
}
.danmakuRow {
	max-width: calc(100% - 8px);
	width: fit-content;
	display: flex;
	flex-wrap: wrap;
	padding: 4px;
	margin: 0px 0px 4px 0px;
	align-items: center;
	& > div {
		flex-shrink: 0;
		margin: 4px;
	}

	font-weight: 700;
	color: rgb(223, 201, 158);
	.extra {
		text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000,
			1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000,
			-1px 0 0 #000;
	}
}
</style>
