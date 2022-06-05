import { defineComponent } from "vue";
import {
	startApplet,
	appletList,
	openFolder,
	openFile
} from "@front/util_function/system";
import path from "path";
export default defineComponent({
	data() {
		return {
			applets: []
		};
	},
	mounted() {
		this.refreshList();
	},
	methods: {
		startApplet,
		refreshList() {
			appletList().then(res => {
				(this.applets as any) = res;
			});
		},
		openFolder() {
			openFolder(path.join(process.resourcesPath, "app/applets"));
		},
		openDocument() {
			openFile({
				url: path.join(
					process.resourcesPath,
					"../使用说明/小程序二次开发文档.md"
				)
			});
		}
	}
});
