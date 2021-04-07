<template>
	<div class="rowSpan" :style="{width:`${span*100/12}%`}">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "rowSpan",
	props: {
		span: {
			type: Number,
			default: 12
		}
	}
});
</script>
<style lang="scss">
.rowSpan {
	position: relative;
	flex-shrink: 0;
	padding-right: 16px;
	box-sizing: border-box;
}
</style>
