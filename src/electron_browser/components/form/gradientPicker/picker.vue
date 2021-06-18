<template>
	<div class="v3-gradient-picker">
		<div class="v3-gradient-picker-preview-container">
			<div class="v3-gradient-picker-preview" :style="previewStyle"></div>
		</div>

		<div class="v3-gradient-picker-stops-container" ref="stopsContainer">
			<div class="v3-gradient-picker-stops-preview-container">
				<div class="v3-gradient-picker-stops-preview" :style="stopsPreviewStyle" @click.stop.prevent="addStop($event)"></div>
			</div>
			<div class="v3-gradient-picker-stop" v-for="(stop, index) in stops" :key="index" :style="stopStyle(index)" :class="{ active: index == currentStopIdx }" @mousedown.stop="handleMouseDown(index, $event)"
				@contextmenu.stop="handleMouseRightCLick(index,$event)">
				<el-color-picker show-alpha size="mini" :modelValue="stops[index][0]" @update:modelValue="stops[index][0] = $event.replaceAll(' ','')" />
			</div>
		</div>

		<div class="v3-gradient-picker-controls-container">
			<div class="v3-gradient-picker-slider-container">
				<input type="range" min="0" max="360" step="1" v-model="angle" />
				<div class="label">角度</div>
			</div>
			<div class="v3-gradient-picker-input-container">
				<input type="text" v-model="angle" />
				<div class="label">Deg&deg;</div>
			</div>
		</div>
	</div>
</template>

<script>
import LinearGradient from "./LinearGradient";
import {
	defineComponent,
	ref,
	reactive,
	computed,
	onBeforeMount,
	toRefs,
	watch
} from "vue";
import "element-plus/lib/theme-chalk/index.css";
import { ElColorPicker } from "element-plus";

export default defineComponent({
	name: "gradient-picker",
	components: {
		ElColorPicker
	},
	props: {
		modelValue: {
			default: new LinearGradient()
		}
	},
	setup(props, context) {
		const COLOR = 0;
		const POSITION = 1;

		const { modelValue } = toRefs(props);

		const emitInput = (angle, stops) => {
			context.emit(
				"update:modelValue",
				new LinearGradient({ angle, stops })
			);
		};
		onBeforeMount(() => {
			if (!(modelValue.value instanceof LinearGradient)) {
				emitInput();
			}
		});
		const currentStopIdx = ref(0);

		const angle = computed({
			get: () => modelValue.value.angle,
			set: val => {
				let degrees = parseInt(val, 10) || 0;
				if (degrees < 0) degrees = 0;
				else if (degrees > 360) degrees = 360;
				emitInput(degrees, modelValue.value.stops);
			}
		});
		const stops = computed({
			get: () => modelValue.value.stops || [],
			set: val => emitInput(modelValue.value.angle, val)
		});
		const orderedStops = computed(() => {
			return [...stops.value].sort((a, b) => a[POSITION] - b[POSITION]);
		});

		const getGradientString = angle => {
			if (orderedStops.value.length === 1) {
				return orderedStops.value[0][COLOR];
			}
			const color = orderedStops.value
				.map(
					stop => `${stop[COLOR].toString()} ${stop[POSITION] * 100}%`
				)
				.join(",");
			return `linear-gradient(${angle}deg, ${color})`;
		};

		const previewStyle = computed(() => {
			return {
				background: getGradientString(angle.value)
			};
		});
		const stopsPreviewStyle = computed(() => {
			return {
				background: getGradientString(90)
			};
		});
		const currentColor = computed({
			get: () => {
				return stops.value[currentStopIdx.value][COLOR];
			},
			set: val => {
				stops.value[currentStopIdx.value][COLOR] = val;
				emitInput(angle, stops.value);
			}
		});

		const setCurrentStopIdx = index => {
			currentStopIdx.value = index;
		};
		const stopStyle = index => {
			return {
				left: `${stops.value[index][POSITION] * 100}%`
			};
		};

		const addStop = e => {
			const position =
				Math.round((e.offsetX * 100) / e.target.offsetWidth) / 100;
			stops.value.push([currentColor.value, position]);
			setCurrentStopIdx(stops.value.length);
		};

		const removeCurrentStop = () => {
			if (stops.value.length === 1) {
				throw new Error("minimum stop is 2");
			}
			stops.value.splice(currentStopIdx.value, 1);
			setCurrentStopIdx(currentStopIdx.value - 1);
		};

		const stopsContainer = ref(null);
		let containerBoundingClientRectangle = reactive({});
		const setContainerBoundingClientRectangle = () => {
			containerBoundingClientRectangle = stopsContainer.value.getBoundingClientRect();
		};

		const handleChange = event => {
			event.preventDefault();
			event.stopPropagation();

			const x =
				(event.touches ? event.touches[0].clientX : event.clientX) || 0;
			const left = x - containerBoundingClientRectangle.left;

			const containerWidth = containerBoundingClientRectangle.width;
			let position = 0;
			if (left < 0) {
				position = 0;
			} else if (left > containerWidth) {
				position = 1;
			} else {
				position = Math.round((left * 100) / containerWidth) / 100;
			}

			stops.value[currentStopIdx.value][POSITION] = position;
		};

		const handleMouseRightCLick = (index, e) => {
			e.preventDefault();
			e.stopPropagation();
			setCurrentStopIdx(index);
			removeCurrentStop();
		};
		const handleMouseDown = index => {
			setCurrentStopIdx(index);
			setContainerBoundingClientRectangle();
			window.addEventListener("mousemove", handleChange);
			window.addEventListener("mouseup", handleMouseUp);
		};

		const handleMouseUp = () => unbindEventListeners();
		const unbindEventListeners = () => {
			window.removeEventListener("mousemove", handleChange);
			window.removeEventListener("mouseup", handleMouseUp);
		};
		// beforeUnmount(() => {
		// 	unbindEventListeners();
		// });
		return {
			previewStyle,
			stopsPreviewStyle,
			currentStopIdx,
			angle,
			stops,
			stopStyle,
			addStop,
			handleMouseDown,
			handleMouseRightCLick,
			stopsContainer,
			orderedStops,
			emitInput
		};
	}
});
</script>

<style lang="scss" scoped>
.v3-gradient-picker {
	position: relative;
	display: flex;
	flex-direction: column;
	background: #fff;
	border-radius: 4px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	width: 200px;
	padding: 8px;
	.v3-gradient-picker-preview-container {
		width: 200px;
		height: 150px;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC);
		background-size: 10px;
		position: relative;
		.v3-gradient-picker-preview {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
	.v3-gradient-picker-stops-container {
		position: relative;
		.v3-gradient-picker-stops-preview-container {
			width: 200px;
			height: 24px;
			background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC);
			background-size: 10px;
			position: relative;
			margin-top: 4px;
			border-radius: 2px;
			.v3-gradient-picker-stops-preview {
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				border-radius: 2px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
					0 0 6px rgba(0, 0, 0, 0.04);
			}
		}
		.v3-gradient-picker-stop {
			position: absolute;
			bottom: 0;
			padding-bottom: 5px;
			background-color: white;
			border: 2px solid white;
			width: 10px;
			height: 15px;
			transform: translateY(50%) translateX(-50%);
			justify-content: center;
			align-items: center;
			cursor: pointer;
			overflow: hidden;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
				0 0 6px rgba(0, 0, 0, 0.04);
			:deep .el-color-picker {
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 50%;
				.el-color-picker__trigger {
					padding: 0px !important;
					position: absolute;
					border: 0px;
					left: 0px;
					width: 100%;
					height: 100%;
				}
				.el-color-picker__color {
					border-radius: 0px;
					border: 0px;
				}
				.el-color-picker__icon {
					display: none;
				}
			}
		}
	}
	.v3-gradient-picker-controls-container {
		margin-top: 24px;
		display: flex;
		font-size: 0;
		.v3-gradient-picker-slider-container {
			flex-grow: 1;
			input {
				box-sizing: border-box;
				width: 100%;
				height: 19px;
				margin: 0 2px;
				padding: 0;
				background-color: transparent;
				appearance: none;
				outline: none;
				&::-webkit-slider-thumb {
					-webkit-appearance: none;
					cursor: pointer;
					width: 5px;
					border-radius: 1px;
					height: 10px;
					border: 0;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
						0 0 6px rgba(0, 0, 0, 0.04);
					background: #fff;
					z-index: 2;
				}

				&::-moz-range-thumb {
					cursor: pointer;
					width: 5px;
					border-radius: 1px;
					height: 10px;
					border: 0;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
						0 0 6px rgba(0, 0, 0, 0.04);
					background: #fff;
				}

				&::-ms-thumb {
					cursor: pointer;
					width: 5px;
					border-radius: 1px;
					height: 10px;
					border: 0;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
						0 0 6px rgba(0, 0, 0, 0.04);
					background: #fff;
				}

				&::-webkit-slider-runnable-track {
					width: 100%;
					height: 10px;
					cursor: pointer;
					background: rgba(0, 0, 0, 0.05);
					border: 0;
					border-radius: 2px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
						0 0 6px rgba(0, 0, 0, 0.04);
					z-index: 1;
				}

				&::-moz-range-track {
					width: 100%;
					height: 10px;
					cursor: pointer;
					background: rgba(0, 0, 0, 0.05);
					border: 0;
					border-radius: 2px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
						0 0 6px rgba(0, 0, 0, 0.04);
				}

				&::-ms-track {
					width: 100%;
					height: 10px;
					cursor: pointer;
					background: transparent;
					border-color: transparent;
					border-width: 16px 0;
					color: transparent;
				}
				&::-ms-fill-lower {
					border: 0;
					background: rgba(0, 0, 0, 0.05);
					border-radius: 2px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
						0 0 6px rgba(0, 0, 0, 0.04);
				}
				&::-ms-fill-upper {
					border: 0;
					background: rgba(0, 0, 0, 0.05);
					border-radius: 2px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
						0 0 6px rgba(0, 0, 0, 0.04);
				}
			}
		}
		.v3-gradient-picker-input-container {
			width: 30px;
			margin-left: 8px;
			input {
				text-align: center;
				box-sizing: border-box;
				width: 100%;
				padding: 4px 0 3px;
				border: none;
				outline: none;
				box-shadow: inset 0 0 0 1px #ccc;
				font-size: 10px;
			}
		}
		.label {
			text-align: center;
			font-size: 11px;
			color: #222;
			padding-top: 3px;
			padding-bottom: 4px;
			text-transform: capitalize;
		}
	}
}
</style>
