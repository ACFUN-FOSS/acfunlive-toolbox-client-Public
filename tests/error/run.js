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
	const logFileArray = fs.readFileSync(path.join(__dirname, "./TellFQZWhatHappened.log"), "utf8").split("\r\n");
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
		if (!line) {
			continue
		}
		const lines = line.split("\n");
		output.push(lines[0]);
		const [file, version] = lines[1].split("@");
		const p = path.join(__dirname, `../../mapFiles/${version}`)
		try {
			const column = file.match(/\d+$/g)[0];
			const fileName = file.match(/[^\/]+\.js/g)[0] + ".map";
			if (!sources[fileName]) {
				sources[fileName] = await createFinder(path.join(p, fileName));
			}
			const result = sources[fileName].originalPositionFor({
				line: 1,
				column
			});
			output.push(`at ${path.join(__dirname,result.source.replace("webpack:///","../../"))}, line:${result.line}, column:${result.column}`);
		} catch (error) {}
	}
	console.log(output.join("\r\n"));
}

log();
