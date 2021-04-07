const path = require("path");
module.exports = {
	pages: {
		index: {
			entry: "./src/electron_browser/main.ts"
		}
	},
	pluginOptions: {
		electronBuilder: {
			mainProcessFile: "src/electron_nodejs/main.ts",
			outputDir: "BUILD",
			nodeIntegration: true,
			builderOptions: {

				productName: "ACFUN弹幕工具箱",
				extraResources: {
					from: "./extraResources/"
				}
			}

		}
	},
	configureWebpack: {
		resolve: {
			mainFields: ["module", "main"],
			alias: {
				"@fe": path.join(__dirname, "src/electron_browser")
			}
		},
		entry: {
			main: "./src/electron_browser/main.ts"
		}
	}
};
