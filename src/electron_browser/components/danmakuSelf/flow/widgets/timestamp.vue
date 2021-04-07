<template>
	<div class="timestamp">{{getTime(danmaku)}}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { format, fromUnixTime } from "date-fns";
import { getTime } from "./danmakuGetter";
export default defineComponent({
	name: "timestamp",
	props: {
		danmaku: {
			required: true
		}
	},
	methods: {
		getTime(danmaku: any) {
			return format(fromUnixTime(getTime(danmaku) / 1000), "HH:mm:ss");
		}
	}
});
</script>
<style scoped lang='scss'>
.timestamp {
	text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000,
		1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
	color: white;
}
</style>
