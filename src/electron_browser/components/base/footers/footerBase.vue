<template>
	<div class="foter">{{ footer.base }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { footer } from "@front/texts";
export default defineComponent({
	name: "footerBase",
	computed: {
		footer
	}
});
</script>

<style scoped lang="scss">
.foter {
	white-space: pre;
	user-select: none;
	color: rgba($color: white, $alpha: 0.7);
}
</style>
