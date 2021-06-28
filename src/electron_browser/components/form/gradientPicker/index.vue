<template>
	<div class="gradient-picker" @click="dialog=true">
		<div :style="{background:modelValue}" />
	</div>
	<el-dialog title="颜色选择" width="fit-content" v-model="dialog" :show-close="false">
		<div>
			<gradient-picker ref="colorPicker" click.stop v-model="input" />
		</div>
		<div style="font-size:12px;margin-top:8px;width:200px">点击横条增加颜色，左击标签改变颜色，右击标签删除</div>
		<template #footer>
			<el-button @click="dialog = false" size="mini">取消</el-button>
			<el-button @click="close" size="mini" type="primary">确认</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import gradientPicker from "./picker.vue";
// @ts-ignore
import LinearGradient from "./LinearGradient";
// @ts-ignore
import tinycolor from "tinycolor2";
export default defineComponent({
	name: "gradientPickerTo",
	components: { gradientPicker },
	props: {
		modelValue: {
			type: String,
			default: ""
		}
	},
	data() {
		const input: any = "";
		return {
			input,
			dialog: false
		};
	},
	watch: {
		modelValue: {
			handler(n): any {
				this.input = this.stringToGradient(n);
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		close() {
			this.dialog = false;
			this.$emit(
				"update:modelValue", // @ts-ignore
				this.$refs.colorPicker.previewStyle.background
			);
		},
		gradientToString(e: LinearGradient) {
			if (e instanceof LinearGradient) {
				if (e.stops.length === 1) {
					this.$emit("update:modelValue", e.stops[0][0]);
				}
				this.$emit("update:modelValue", e.toString());
				return;
			}
			this.$emit("update:modelValue", "");
		},
		stringToGradient(gradientString: string) {
			if (gradientString.includes("linear-gradient")) {
				const angle = this.getAngle(gradientString);
				const stops = this.getStops(gradientString);
				return new LinearGradient({
					angle,
					stops
				});
			}
			if (gradientString.includes("#")) {
				gradientString = tinycolor(gradientString).toRgbString();
			}
			if (!gradientString) gradientString = "rgba(0,255,0,1)";
			return new LinearGradient({
				angle: 90,
				stops: [[gradientString, 0.5]]
			});
		},
		getAngle(gradientString: string): number {
			const match = gradientString.match(/(?!\()\d+(?=(deg))/g);
			if (match) {
				return Number(match[0]);
			}
			return 0;
		},
		getStops(gradientString: string) {
			let matchs = gradientString.match(/(?<=\()[\s\S]+(?=\))/g);
			if (!matchs) {
				return [];
			}
			console.log(matchs);
			matchs = matchs[0]
				.split(/(\s|(?<=%),)/)
				.slice(1)
				.join(" ")
				.split(/(?<!(\d,))\s/)
				.filter(i => i);
			const stops: any = [];
			let currentStop: any = [];
			matchs.forEach((match: any) => {
				// console.log(match);
				if (match.includes("rgb")) {
					if (currentStop.length) {
						stops.push([...currentStop, 0]);
					}
					currentStop = [match];
				} else {
					if (match.includes("%")) {
						stops.push([...currentStop, parseFloat(match) / 100]);
					} else if (match.includes(".")) {
						stops.push([...currentStop, parseFloat(match)]);
					}
					currentStop = [];
				}
			});
			return stops;
		}
	}
});
</script>

<style lang="scss" scoped>
@import "@front/styles/variables.scss";
.gradient-picker {
	width: 50px;
	height: 28px;
	margin-top: 6px;
	position: relative;
	border: $--border-base;
	box-sizing: border-box;
	border-radius: $--border-radius-small;
	& > div {
		margin: 4px;
		width: calc(100% - 8px);
		height: calc(100% - 8px);
		cursor: pointer;
	}
}
</style>
