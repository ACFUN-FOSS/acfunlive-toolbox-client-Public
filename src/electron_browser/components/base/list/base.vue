<template>
	<div class="list">
		<div class="list-item" :class="{selected:selected===i}" v-for="i in list" :key="i.id">
			<span class="list-item-title">{{i.label}}</span>
			<span class="list-item-icon"><span v-for="(a,index) in action" :key="index" :class="a.icon" @click="a.action(i)" /></span>
		</div>
		<div v-if="list.length===0" class="empty">{{emptytip}}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "list",
	props: {
		list: {
			default: () => {
				return [];
			}
		},
		action: {
			default: () => {
				return [];
			}
		},
		selected: {
			default: ""
		},
		emptytip: {
			default: "空空如也"
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
.list {
	border: $--border-base;
	border-radius: $--border-radius-base;
	background-color: $--border-color-lighter;
	color: $--color-text-regular;
	position: relative;
	overflow-y: scroll;
	box-sizing: border-box;
	@include scrollbarDark();
	.list-item {
		margin: 5px 5px;
		background-color: white;
		box-shadow: $--box-shadow-base;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5px;
		&.selected,
		&:hover {
			color: $--color-primary-light-3;
			box-shadow: 0 2px 4px rgba($--color-primary, 0.12),
				0 0 6px rgba($--color-primary, 0.04);
		}
		.list-item-icon > span {
			color: $--color-text-secondary;
			cursor: pointer;
			&:hover {
				color: $--color-primary-light-3;
			}
		}
	}
	.empty {
		position: absolute;
		left: 50%;
		top: 40%;
		transform: translateX(-50%) translateY(-50%);
	}
}
</style>
