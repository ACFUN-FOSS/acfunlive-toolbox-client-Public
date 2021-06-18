<template>
	<div class="rightClickMenu" :class="position" :style="{
			zIndex: zIndex
		}" @mouseleave="current = -1">
		<div class="rightClickMenuList" v-for="(item,index) in list" :class="{disabled:item.disabled}" :key="index" @click.stop="call(item.event)" @mouseover="current = index" v-show="item.show">
			<div>
				<span :class="item.icon" class="listIcon"></span>
				<span class="listWord">{{" "+item.name}}</span>
			</div>
			<div v-if="item.children&&item.children.length>0" class="el-icon-arrow-right spanIcon" />
			<right-click-menu-list-b v-if="current==index&&item.children&&item.children.length>0" :list="item.children" :index="zIndex" @close="$emit('close')" />
		</div>
	</div>
</template>

<script>
export default {
	name: "rightClickMenuListB",
	props: ["list", "index"],
	data() {
		return {
			current: -1,
			position: "rightBottom",
			zIndex: 4000
		};
	},
	mounted() {
		if (this.index) {
			this.zIndex = this.index + 1;
		}
		this.$nextTick(() => {
			const positions = this.$el.getBoundingClientRect();
			const height = positions.height + positions.y;
			const width = positions.width + positions.x;
			if (
				height > document.body.offsetHeight &&
				width > document.body.offsetWidth
			) {
				this.position = "leftTop";
			} else if (
				height > document.body.offsetHeight &&
				width < document.body.offsetWidth
			) {
				this.position = "rightTop";
			} else if (
				height < document.body.offsetHeight &&
				width > document.body.offsetWidth
			) {
				this.position = "leftBottom";
			} else {
				this.position = "rightBottom";
			}
		});
	},
	methods: {
		call(event) {
			if (event) {
				this.$emit("close");
				event();
			}
		}
	}
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
