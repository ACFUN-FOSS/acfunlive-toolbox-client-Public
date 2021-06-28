<template>
	<img ref="img" class="gift-block" :style="picture" v-if="getGift(danmaku).display&&setting?.config?.type=='picture'" :src="getGift(danmaku).giftDetail.webpPic" @error="reload" />
	<div class="gift" :style="gname" v-else-if="getGift(danmaku).display&&setting?.config?.type=='name'">{{getGift(danmaku)?.giftDetail.giftName}}</div>
	<div class="gift" :style="price" v-else-if="getGift(danmaku).display&&setting?.config?.type=='price'">{{getGiftValue(danmaku)?`${getGiftValue(danmaku)/1000} AC币`:"免费"}}</div>
	<div class="gift" :style="number" v-else-if="getGift(danmaku).display&&setting?.config?.type=='number'"><span class="combo" :key="count||1">{{count||getGift(danmaku)?.count}}</span></div>
	<div class="gift" v-else />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getGift, getGiftValue } from "../../utils/getter";
import {
	size,
	padding,
	margin,
	border,
	outerBox,
	font,
	position,
	transform
} from "../../utils/styleGetter";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "giftBlock",
	cname: "礼物",
	widgetOptions: {
		avaliable: [1005],
		limit: -1
	},
	props: {
		danmaku: {
			required: true
		},
		setting: {
			default: defaultValue()
		},
		count: {
			default: false
		}
	},
	data() {
		return {
			settingValue: defaultValue,
			settingForm: form
		};
	},
	computed: {
		picture(): any {
			// @ts-ignore
			const style = this.setting?.style;
			if (!style) {
				return {};
			}
			return {
				...size(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...position(style),
				...transform(style)
			};
		},
		gname(): any {
			// @ts-ignore
			const style = this.setting?.style;
			if (!style) {
				return {};
			}
			return {
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...font(style),
				...position(style),
				...transform(style)
			};
		},
		price(): any {
			// @ts-ignore
			const style = this.setting?.style;
			if (!style) {
				return {};
			}
			return {
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...font(style),
				...position(style),
				...transform(style)
			};
		},
		number(): any {
			// @ts-ignore
			const style = this.setting?.style;
			if (!style) {
				return {};
			}
			return {
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...font(style),
				...position(style),
				...transform(style)
			};
		}
	},
	methods: {
		getGift,
		getGiftValue,
		reload() {
			const img: any = this.$refs.img;
			if (img) {
				img.src =
					img.src.substr(0, img.src.indexOf("?")) +
					"?t=" +
					new Date().getTime();
			}
		}
	}
});
</script>
<style scoped lang='scss'>
.gift {
	display: inline;
	position: relative;
	// .level {
	// }
	// .name {
	// }
}
.gift-block {
	display: inline-block;
	position: relative;
}

.combo {
	display: inline-block;
	vertical-align: middle;
	animation: scale 0.5s forwards;
}
@keyframes scale {
	0% {
		transform: scale(3);
	}
	100% {
		transform: scale(1);
	}
}
</style>
