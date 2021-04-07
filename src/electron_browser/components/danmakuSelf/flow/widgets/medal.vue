<template>
	<div class="medal" :class="getMedalClass(danmaku)" v-if="getMedal(danmaku).clubName">
		<div class="level">{{getMedal(danmaku).level}}</div>
		<div class="name">{{getMedal(danmaku).clubName}}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getMedal } from "./danmakuGetter";
export default defineComponent({
	name: "medal",
	props: {
		danmaku: {
			required: true
		}
	},
	methods: {
		getMedal(danmaku: any) {
			return getMedal(danmaku);
		},
		getMedalClass(danmaku: any) {
			const level = getMedal(danmaku).level;
			if (level < 5) {
				return "a";
			} else if (level < 10) {
				return "b";
			} else if (level < 15) {
				return "c";
			} else {
				return "d";
			}
		}
	}
});
</script>
<style scoped lang='scss'>
.medal {
	border: solid 2px black;
	border-radius: 200px;
	margin: 0px 8px;
	display: flex;
	align-items: center;
	overflow: hidden;
	height: 22px;
	.level {
		background-color: black;
		color: white;
		padding: 2px 4px;
	}
	.name {
		font-weight: 700;
		padding: 0px 4px;
		text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000,
			1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000,
			-1px 0 0 #000;
	}
	&.a {
		border-color: rgb(65, 155, 239);
		.level {
			background-color: rgb(65, 155, 239);
		}
		.name {
			color: rgb(65, 155, 239);
		}
	}
	&.b {
		border-color: rgb(255, 171, 1);
		.level {
			background-color: rgb(255, 171, 1);
		}
		.name {
			color: rgb(255, 171, 1);
		}
	}
	&.c {
		border-color: rgb(239, 84, 81);
		.level {
			background-color: rgb(239, 84, 81);
		}
		.name {
			color: rgb(239, 84, 81);
		}
	}
	&.d {
		border-color: rgb(207, 29, 255);
		.level {
			background-color: rgb(207, 29, 255);
		}
		.name {
			color: rgb(207, 29, 255);
		}
	}
}
</style>
