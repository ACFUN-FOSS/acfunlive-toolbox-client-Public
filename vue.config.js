const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;
module.exports = {
	productionSourceMap: true,
	pages: {
		index: {
			entry: "./src/electron_browser/main.ts"
		}
	},
	parallel: false,

	pluginOptions: {
		electronBuilder: {
			customFileProtocol: "/",
			mainProcessFile: "src/electron_nodejs/main.ts",
			outputDir: "BUILD",
			nodeIntegration: true,
			builderOptions: {
				productName: "ACFUN直播工具箱",
				asar: false,
				extraFiles: [
					{
						from: "./documents",
						to: "使用说明"
					},
					"LICENSE"
				],
				// win: {
				// 	requestedExecutionLevel: "requireAdministrator"
				// },
				directories: {
					output: path.join("BUILD", process.env.npm_package_version)
				},
				nsis: {
					oneClick: false,
					allowToChangeInstallationDirectory: true
				},
				files: [
					"**/*",
					"!**/acbackend-*",
					"**/acbackend-${os}-${arch}*"
				]
			}
		}
	},
	chainWebpack: config => {
		config.module.rule("js").exclude.add(/\.worker\.js$/);
	},
	configureWebpack: {
		// optimization: {
		// 	usedExports: true,
		// },
		devServer: {
			proxy: {
				"/liveChat": {
					target: "http://localhost:1133",
					changeOrigin: true,
					ws: true,
					pathRewrite: {
						"^/liveChat": "/liveChat"
					}
				}
			},
			watchOptions: {
				ignored: /public/
			},
			after: function(devServer) {
				const {
					startSocket
				} = require("./src/electron_nodejs/utils/socket.js");
				startSocket(devServer);
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
		module: {
			rules: [
				{
					test: /shared\.worke/g,
					use: [
						{
							loader: "babel-loader",
							options: {
								presets: ["@babel/preset-env"]
							}
						},
						{
							loader: "worker-loader",
							options: {
								worker: "SharedWorker"
							}
						}
					]
				}
			]
		},
		entry: {
			main: "./src/electron_browser/main.ts"
		}
	}
};
