<template>
	<div class="danmaku">
		<super-chat-list />
		<component :is="component" />
	</div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";
import superChatList from "@front/components/superChat/index.vue";
import { getMockByType } from "@front/views/danmakuSetting/mock/index";
import { scGiftHandler } from "@front/components/superChat/utils/getter";
import output from "@front/components/superChat/backgrounds";
export default defineComponent({
	cname: "超级聊",
	name: "superChat",
	components: { superChatList },
	data() {
		const timer: any = null;
		const component: any = null;
		return {
			timer,
			component
		};
	},
	mounted() {
		this.count();
	},
	beforeMount() {
		clearTimeout(this.timer);
	},
	methods: {
		count() {
			clearTimeout(this.timer);
			scGiftHandler(getMockByType(1005), this.$store);
			setTimeout(() => {
				this.count();
			}, 2000);
		}
	}
});
</script>
<style scoped lang='scss'>
.danmaku {
	width: 400px;
	padding: 5px;
	background-color: chocolate;
}
</style>
