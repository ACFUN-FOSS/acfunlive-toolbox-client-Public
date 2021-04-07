<template>
	<div class="iconCounter">
		<span :class="icon" />{{num}}
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "iconCounter",
	props: {
		icon: {
			type: String,
			default: "el-icon-bell"
		},
		num: {
			default: 0
		},
		increaseAni: {
			type: Boolean,
			default: false
		},
		decreaseAni: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		num(n, o) {
			this.ani(n, o);
		}
	},
	methods: {
		ani(n: any, o: any) {
			if (typeof n === "string" || typeof n !== typeof o) {
				return;
			}

			return 1;
		}
	}
});
</script>
<style scoped lang='scss'>
.iconCounter {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-right: 8px;
	user-select: none;
	white-space: nowrap;
	span {
		margin-right: 2px;
	}
}
</style>
