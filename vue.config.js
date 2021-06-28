const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
	productionSourceMap: true,
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
				extraFiles: {
					from: "./documents",
					to: "使用说明"
				},
				directories: {
					output: path.join("BUILD", process.env.npm_package_version)
				},
				nsis: {
					oneClick: false,
					allowToChangeInstallationDirectory: true
				}
			}

		},
	},
	configureWebpack: {
		// optimization: {
		// 	usedExports: true,
		// },
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
		},
		plugins: [
			// new BundleAnalyzerPlugin(),
		],
	}
};
