<template>
	<div class="danmaku" v-menu="list">
		<div class="timestamp">右键点击</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import menu from "@front/directives/menu";
import { rightClickMenuItem } from "@front/datas/component";
export default defineComponent({
	cname: "右键菜单",
	name: "rightClickMenu",
	directives: {
		menu: menu()
	},
	data() {
		return {};
	},
	computed: {
		list(): Array<any> {
			return [
				{
					name: "当前选择:阿婵不会输",
					icon: "el-icon-user-solid",
					show: true,
					disabled: true,
					children: [
						{
							name: "取消房管",
							icon: "el-icon-arrow-right",
							show: true,
							disabled: false
						}
					]
				},
				{
					name: "取消房管",
					icon: "el-icon-arrow-right",
					show: true,
					disabled: false
				},
				{
					name: "添加房管",
					icon: "el-icon-arrow-right",
					show: true,
					disabled: false,
					children: [
						{
							name: "取消房管",
							icon: "el-icon-arrow-right",
							show: true,
							disabled: false,
							children: [
								{
									name: "取消房管",
									icon: "el-icon-arrow-right",
									show: true,
									disabled: false,
									children: [
										{
											name: "取消房管",
											icon: "el-icon-arrow-right",
											show: true,
											disabled: false,
											children: [
												{
													name: "取消房管",
													icon: "el-icon-arrow-right",
													show: true,
													disabled: false
												}
											]
										}
									]
								}
							]
						},
						{
							name: "取消房管",
							icon: "el-icon-arrow-right",
							show: true,
							disabled: false
						}
					]
				}
			];
		}
	}
});
</script>
<style scoped lang='scss'>
.danmaku {
	width: 100%;
	height: 100%;
	padding: 5px;
	background-color: greenyellow;

	& > div {
		display: inline;
	}
}
</style>
