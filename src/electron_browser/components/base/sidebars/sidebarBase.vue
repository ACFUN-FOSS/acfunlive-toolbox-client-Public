<template>
	<div id="sidebar">
		<div class="mainTitle">{{ generalConfig.title }}</div>
		<div class="subTitle">{{ generalConfig.subTitle }}</div>
		<div class="sidebarList">
			<div class="listBlock" v-for="item in contents" :key="item.meta.label">
				<div class="blockTitle">{{ item.meta.label }}</div>
				<div class="blockRow" v-for="row in item.children" :key="row.meta.label"
					:class="{active:$route.name==row.name,disabled:row.meta.disabled?row.meta.disabled():false}"
					@click="$Event.emit('routeChange',{name:row.name});row.meta.action==='router'?$router.push(row.name):false">
					<span class="rowIcon" :class="row.meta.icon" />{{ row.meta.label }}
				</div>
			</div>
		</div>
		<div class="footer">{{ generalConfig.footerS }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { config } from "@fe/mixins/mixin";
import content from "@fe/router/content";
export default defineComponent({
	name: "sidebarBase",
	mixins: [config],
	computed: {
		contents() {
			return content;
		}
	}
});
</script>

<style scoped lang="scss">
@import "@fe/assets/scss/base.scss";
#sidebar {
	// position: absolute;
	box-sizing: border-box;
	flex-shrink: 0;
	flex-grow: 0;
	height: 100%;
	width: 210px;
	padding: 30px 0px 8px 20px;
	background-color: var(--generalStyle_color_primary);
	display: flex;
	flex-direction: column;
	color: white;
	user-select: none;
	.mainTitle {
		padding-left: 15px;
		padding-right: 25px;
		flex-shrink: 0;
	}
	.subTitle {
		padding: 8px 25px 8px 15px;
		font-size: var(--generalStyle_fontSize_S);
		flex-shrink: 0;
	}
	.footer {
		font-size: var(--generalStyle_fontSize_ES);
		white-space: pre-line;
		color: rgba($color: white, $alpha: 0.7);
		flex-shrink: 0;
		padding: 8px 25px 0px 15px;
	}
	.sidebarList {
		flex-grow: 1;
		flex-shrink: 1;
		padding: 20px 10px 15px 0px;
		margin-right: 2px;
		overflow-y: auto;
		@include scrollbarBase();
		.listBlock {
			margin-bottom: 16px;
			overflow: hidden;
			.blockTitle {
				font-size: var(--generalStyle_fontSize_ES);
				padding: 0px 16px 4px 16px;
				color: rgba($color: white, $alpha: 0.7);
			}
			.blockRow {
				font-size: var(--generalStyle_fontSize_B);
				padding: 6px 12px;
				margin: 6px 4px;
				cursor: pointer;
				letter-spacing: 1px;
				border-radius: 5px;
				&:hover,
				&.active {
					background-color: rgba(255, 255, 255, 0.2);
				}
				&.disabled {
					opacity: 0.5;
					cursor: not-allowed;
					&:hover {
						background-color: transparent;
					}
				}
				.rowIcon {
					padding-right: 8px;
				}
			}
		}
	}
}
</style>
