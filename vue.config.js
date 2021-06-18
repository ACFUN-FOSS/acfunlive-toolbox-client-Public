const path = require("path");
const webpack = require("webpack");
module.exports = {
	pages: {
		index: {
			entry: "./src/electron_browser/main.ts"
		}
	},
	pluginOptions: {
		electronBuilder: {
			customFileProtocol: "/",
			mainProcessFile: "src/electron_nodejs/main.ts",
			outputDir: "BUILD",
			nodeIntegration: true,
			builderOptions: {
				productName: "ACFUN直播工具箱",
				asar: false,
				files: [
					"!configFiles/**",
				],
			}

		}
	},
	configureWebpack: {
		devServer: {
			watchOptions: {
				ignored: /public/
			}
		},
		resolve: {
			mainFields: ["module", "main"],
			alias: {
				"@front": path.join(__dirname, "src/electron_browser"),
				"@back": path.join(__dirname, "src/electron_nodejs"),
				"@root": __dirname
			}
		},
		entry: {
			main: "./src/electron_browser/main.ts"
		}
	}
};
