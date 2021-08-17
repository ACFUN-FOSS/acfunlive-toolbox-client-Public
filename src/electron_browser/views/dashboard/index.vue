<template>
	<content-frame id="dashboard" align="column">

		<row-frame content-class="welcome">
			<div class="boardContent">
				<h1>欢迎</h1>
				<p>亲爱的 {{$store.state.userProfile.nickname}} :</p>
				<p>{{welcome.message}}</p>
			</div>
		</row-frame>
		<row-frame style="margin-right:32px" v-for="(item,index) in welcome.blocks" :key="index" :content-default-class="true" :title="item.title">
			<div class="boardContent">
				<span v-if="item.type == 'string'">{{item.value}}</span>
				<ol v-else-if="item.type=='list'">
					<li v-for="(li,ind) of item.value" :key="ind" v-html="li" />
				</ol>
				<div v-else-if="item.type=='html'" v-html="item.value" />
			</div>
		</row-frame>
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { welcome } from "@front/texts";
export default defineComponent({
	name: "dashboard",
	computed: { welcome }
});
</script>

<style scoped lang="scss">
@import "@front/styles/variables.scss";
#dashboard {
	&::before {
		content: "";
		position: absolute;
		width: 100%;
		height: calc(100% - 32px);
		background-image: url("/imgs/gif/acniang1.gif");
		background-repeat: no-repeat;
		background-position: left bottom;
		background-size: 50%;
		transform: scaleX(-1);
		opacity: 0.2;
		padding-bottom: 8px;
	}
	:deep .welcome {
		color: $--color-text-primary;
		& > h1 {
			margin-top: 0px;
		}
	}
	.boardContent {
		padding: 8px;
	}
}
</style>
