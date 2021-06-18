<template>
	<div id="topbar">
		<div class="handler">
			<handler-moving>
				<span class="el-icon-more-outline" />
			</handler-moving>
		</div>
		<div class="button el-icon-minus" @click="minimize()" />
		<div class="button el-icon-close" @click="close()" />
	</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { minimize, close } from "@front/util_function/system";
const HandlerMoving = defineAsyncComponent(() =>
	import("@front/components/system/HandlerMoving.vue")
);
export default defineComponent({
	name: "topbarBase",
	components: {
		HandlerMoving
	},
	methods: {
		minimize,
		close
	}
});
</script>

<style scoped lang='scss'>
#topbar {
	width: 100%;
	height: 24px;
	display: flex;
	position: relative;
	transition: background-color 0.25s;
	cursor: move;
	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}
	.handler {
		position: relative;
		flex-grow: 1;
		color: white;
	}
	.button {
		display: flex;
		align-items: center;
		cursor: pointer;
		border: none;
		background-color: rgba(0, 0, 0, 0);
		font-size: 14px;
		color: white;
		border-radius: 0px;
		padding: 2px 8px;
		margin: 0px;
		transition: background-color 0.25s;
		&:hover {
			background-color: rgba(0, 0, 0, 0.25);
		}
	}
}
</style>
