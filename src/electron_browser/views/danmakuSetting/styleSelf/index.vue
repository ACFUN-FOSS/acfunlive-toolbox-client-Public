<template>
	<content-frame align="row">
		<row-frame style="width:100%" title="使用说明">
			<span class="hint"
				>原生全功能定制，需要将编译好的html文件放在<a
					href="#"
					@click.stop="openFolder"
					>此处</a
				></span
			><br />
			<span class="hint"
				><a href="#" @click.stop="openDemo">这个</a
				>是demo,需要复制到上述文件夹</span
			><br />
			<span class="hint"
				>弹幕调试可以在 功能-观众端-发送弹幕测试 进行</span
			><br />
		</row-frame>
		<row-frame style="width:100%" title="链接">
			<span class="hint">配置完毕后，复制下方链接至obs即可</span>
			<el-input size="mini" :model-value="url">
				<template #append>
					<el-button
						type="primary"
						size="mini"
						class="btnBase attach"
						@click="copy(url)"
						>复制
					</el-button>
				</template>
			</el-input>
			<span class="hint"
				>默认打开目录下index.html文件，如果要指向其它文件名请在链接最后加“?file=文件名.html”</span
			>
		</row-frame>
	</content-frame>
</template>

<script>
import { defineComponent } from "vue";
import { openFolder } from "@front/util_function/system";
import path from "path";
import { copy } from "@front/util_function/clipboard";
export default defineComponent({
	computed: {
		url: () => `${window.location.origin}/obs/danmakuSelf`
	},
	methods: {
		copy,
		openFolder() {
			openFolder("./selfDanmaku");
		},
		openDemo() {
			openFolder(
				path.join(process.resourcesPath, "../使用说明/自定义弹幕姬")
			);
		}
	}
});
</script>
