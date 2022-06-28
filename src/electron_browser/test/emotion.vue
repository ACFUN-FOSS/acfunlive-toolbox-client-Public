<template>
	<div class="danmaku">
		<danmaku-row
			v-if="setting && danmakuWithEmoji"
			style="white-space:nowrap"
			:setting="setting"
			:configMode="true"
			:danmaku="danmakuWithEmoji"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getMockByType } from "@front/views/danmakuSetting/mock/index";
import danmakuRow from "@/electron_browser/components/danmakuFlow/danmakuRow/index.vue";
export default defineComponent({
	cname: "表情测试",
	name: "emition",
	components: {
		danmakuRow
	},
	data() {
		const emos = this.$store.state.danmakuProfile.common.emojis;
		const danmakuWithEmoji: any = "";
		return {
			emos,
			currentEmoji: {
				scale: 100,
				url: "/configFiles/images/image941968956585.jpg"
			},
			danmaku: getMockByType(1000),
			danmakuWithEmoji
		};
	},
	mounted() {
		this.updateSettings();
	},
	watch: {
		currentEmoji: {
			handler(n: any) {
				const emoji: any = this.currentEmoji;
				if (!emoji || !this.danmaku) {
					this.danmakuWithEmoji = false;
					return;
				}
				const danmaku: any = this.danmaku;
				this.danmakuWithEmoji = {
					...danmaku,
					data: {
						...danmaku.data,
						content:
							danmaku.data.content +
							`<img style="max-width:${n.scale}px;margin-left:8px;vertical-align:bottom" src="${n.url}"/>`
					}
				};
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		setting() {
			try {
				return this.$store.state.danmakuProfile?.web?.settingOfType[
					"1000"
				];
			} catch (error) {
				return false;
			}
		}
	},
	methods: {
		updateSettings() {
			setTimeout(() => {
				fetch("/configFiles/config.json")
					.then((res: any) => res.json())
					.then((json: any) => {
						this.$store.state.danmakuProfile.web = json.web;
						console.log(json.web);
						this.$store.state.danmakuProfile.common = json.common;
					});
			}, 1000);
		}
	}
});
</script>
<style scoped lang="scss">
.danmaku {
	width: 400px;
	padding: 5px;
}
</style>
