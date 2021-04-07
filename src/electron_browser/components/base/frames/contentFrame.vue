<template>
	<div class="contentFrame" :class="align">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "contentFrame",
	props: {
		align: {
			type: String,
			default: "column"
		}
	}
});
</script>

<style scoped lang='scss'>
.contentFrame {
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	&.column {
		flex-direction: column;
		justify-content: flex-start;
		:deep rowFrame {
			margin-right: 4%;
		}
	}
	&.row {
		flex-direction: row;
		align-items: flex-start;
		align-content: flex-start;
		justify-content: space-between;
	}
}
</style>
