<template>
	<div class="foter">{{ generalConfig.footer }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { config } from "@fe/mixins/mixin";
export default defineComponent({
	name: "footerBase",
	mixins: [config]
});
</script>

<style scoped lang="scss">
.foter {
	white-space: pre;
	user-select: none;
	color: rgba($color: white, $alpha: 0.7);
}
</style>
