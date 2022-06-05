fs = require('fs');
const path = require("path");
const sourceMap = require('source-map');
const inquirer = require('inquirer')
// const consumer = new sourceMap.SourceMapConsumer(fs.readFileSync(`D:\\AI\\acfunlive-toolbox-client\\tests\\error\\chunk-common.1f20c524.js.map`, "utf8"));
// consumer.then(c => {
// 	console.log(c.originalPositionFor({
// 		line: 1,
// 		column: 24587
// 	}));
// })


const createFinder = (path) => {
	return new Promise((resolve) => {
		const consumer = new sourceMap.SourceMapConsumer(fs.readFileSync(path, "utf8"));
		consumer.then(c => {
			resolve(c);
		})
	})
}


const log = async () => {
	const logFileArray = [fs.readFileSync(path.join(__dirname, "./TellFQZWhatHappened.log"), "utf8")];
	const output = [];
	const sources = {};
	// let p = await inquirer.prompt({
	// 	type: "input",
	// 	name: "value",
	// 	message: "input the source map path"
	// });
	// p = p.value;
	// if (!p) {
	// 	return
	// }
	for (line of logFileArray) {
		line = line.trim();
		console.log(line, "aaaaaa");
		if (!line) {
			continue
		}
		const [, version] = line.split("@");
		const p = path.join(__dirname, `../../mapFiles/${version}`)
		const lines = line.split("\n");
		output.push(lines.shift());
		while (lines.length) {
			const l = lines.shift();
			try {
				const column = l.match(/\d+/g).pop();

				const fileName = l.match(/[^\/]+\.js/g)[0] + ".map";
				if (!sources[fileName]) {
					sources[fileName] = await createFinder(path.join(p, fileName));
				}
				const result = sources[fileName].originalPositionFor({
					line: 1,
					column
				});
				// console.log(result)
				output.push(`at ${path.join(__dirname, result.source.replace("webpack:///", "../../"))}, line:${result.line}, column:${result.column}`);
			} catch (error) {

			}
		}

	}
	console.log(output.join("\r\n"));
}

log();
