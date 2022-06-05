<template>
	<div id="sidebar">
		<div class="mainTitle">{{ common.title+common.subTitle }}</div>
		<div class="subTitle">版本：{{ common.version }}</div>
		<div class="sidebarList">
			<div class="listBlock" v-for="item in contents" :key="item.meta.label">
				<div class="blockTitle">{{ item.meta.label }}</div>
				<div class="blockRow" v-for="row in item.children" :key="row.meta.label"
					:class="{active:$route.name==row.name,disabled:row.meta.disabled?row.meta.disabled():false}"
					@click="route(row)">
					<span class="rowIcon" :class="row.meta.icon" />{{ row.meta.label }}
				</div>
			</div>
		</div>
		<div class="footer">{{ footer.wrap }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { footer, common } from "@front/texts";
import { event } from "@front/util_function/eventBus";
import content from "@front/router/clientRouter";
export default defineComponent({
	name: "sidebarBase",
	data() {
		return {
			event
		};
	},
	computed: {
		footer,
		common,
		contents() {
			return content.slice(2).filter(i => !i.hidden);
		}
	},
	methods: {
		route(row: any) {
			if (row.meta.disabled && row.meta.disabled()) {
				return;
			}
			event.emit("routeChange", { name: row.name });
			if (row.meta.action === "router") {
				this.$router.push({ name: row.name });
			}

			if (typeof row.meta.action === "function") {
				row.meta.action();
			}
		}
	}
});
</script>

<style scoped lang="scss">
@import "@front/styles/variables.scss";

@import "@front/styles/scrollbar.scss";
@font-face {
	font-family: "包图小白体";
	src: url("/fonts/包图小白体.ttf") format("truetype");
}

#sidebar {
	// position: absolute;
	box-sizing: border-box;
	flex-shrink: 0;
	flex-grow: 0;
	height: 100%;
	width: 210px;
	padding: 30px 0px 8px 20px;
	background-color: $--color-primary;
	display: flex;
	flex-direction: column;
	color: white;
	user-select: none;
	.mainTitle {
		padding-left: 65px;
		padding-right: 15px;
		font-size: 22px;
		line-height: 25px;
		flex-shrink: 0;
		font-family: 包图小白体;
		font-weight: 700px;
		background-image: url("/imgs/common/logo.gif");
		background-size: auto 110%;
		background-repeat: no-repeat;
		background-position-x: 0px;
	}
	.subTitle {
		padding: 8px 25px 8px 15px;
		font-size: 20px;
		flex-shrink: 0;
		font-family: 包图小白体;
	}
	.footer {
		font-size: $--font-size-extra-small;
		white-space: pre-line;
		color: rgba($color: white, $alpha: 0.7);
		flex-shrink: 0;
		padding: 8px 25px 0px 15px;
	}
	.sidebarList {
		flex-grow: 1;
		flex-shrink: 1;
		padding: 20px 0px 15px 0px;
		margin-right: 2px;
		overflow-y: auto;
		@include scrollbarBase();
		.listBlock {
			margin-bottom: 16px;
			overflow: hidden;
			.blockTitle {
				font-size: $--font-size-extra-small;
				padding: 0px 16px 4px 16px;
				color: rgba($color: white, $alpha: 0.7);
			}
			.blockRow {
				font-size: $--font-size-base;
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
