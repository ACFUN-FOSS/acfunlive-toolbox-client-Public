<template>
	<content-frame align="row" id="records">
		<div class="recordList">
			<div style="display:flex;justify-content:space-between">
				<div class="hint">点击按钮下载录像，只有使用工具箱进行过直播的记录才会显示在这里</div>
				<el-button style="margin-top:8px" size="mini" type="primary" @click="openDocument">说明文档</el-button>
			</div>
			<div v-for="(record,index) in records" class="recordRow" :key="index">
				<div class="title">{{record.time}}</div>
				<div class="btn-group">
					<el-button class="btn" type="primary" size="mini" @click="copyRecord(record.liveID)">复制下载链接
					</el-button>
				</div>
			</div>
		</div>
	</content-frame>
</template>

<script>
import { defineComponent } from "vue";
import { load, openFile } from "@front/util_function/system";
import { copy } from "@front/util_function/clipboard";
import { record } from "@front/api/stream";
import path from "path";
export default defineComponent({
	name: "records",
	data() {
		return {
			records: [
				{
					time: "1992年12月7日 12:00:00",
					liveID: "cgbKNA8R5nY"
				}
			]
		};
	},
	mounted() {
		load({ url: "./recordList.json" }).then(res => {
			try {
				this.records = JSON.parse(res) || [];
			} catch (error) {}
		});
	},
	methods: {
		copyRecord(liveID) {
			if (!liveID) return;
			record({
				liveID
			}).then(res => {
				copy(res.url);
			});
		},

		openDocument() {
			openFile({
				url: path.join(
					process.resourcesPath,
					"../使用说明/录像下载说明.docx"
				),
				create: false
			});
		}
	}
});
</script>
<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
#records {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.recordList {
	position: absolute;
	width: 100%;
	height: calc(100%);
	box-sizing: border-box;
	@include scrollbarDark();
}
.recordRow {
	width: calc(100% - 8px);
	box-shadow: $--box-shadow-base;
	box-sizing: border-box;
	padding: 4px;
	margin: 8px 4px;
	justify-content: space-between;
	align-items: center;
	display: flex;
	&:hover {
		color: $--color-primary;
		box-shadow: $--box-shadow-light;
	}
}
.title {
	padding-left: 8px;
}

.btn-group {
	display: flex;
	flex-direction: row;
}
.btn {
	padding: 10px 20px;
}
</style>
