const fs = require('fs')
const path = require("path");
const archiver = require('archiver');
const version = process.env.npm_package_version;
const deleteFolderRecursive = (path) => {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach((file) => {
			var curPath = path + "/" + file;
			if (fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};
if (process.argv[2] === "pre") {
	const p =
		path.join(__dirname, '/public/configFiles/');
	const deleteFolderRecursive = (path) => {
		if (fs.existsSync(path)) {
			fs.readdirSync(path).forEach((file) => {
				var curPath = path + "/" + file;
				if (fs.lstatSync(curPath).isDirectory()) { // recurse
					deleteFolderRecursive(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	};
	try {
		deleteFolderRecursive(p)
		//file removed
	} catch (err) {
		console.error(err)
	}
}


if (process.argv[2] === "after") {
	const p = path.join("./BUILD", version);
	try {
		deleteFolderRecursive(path.join(p, `${version}.rar`))
	} catch (error) {
		console.log(error)
	}
	try {
		deleteFolderRecursive(path.join(p, `${version}.zip`))
	} catch (error) {
		console.log(error)
	}
	const output = fs.createWriteStream(path.join(p, `${version}.zip`));
	const archive = archiver('zip', {
		zlib: {
			level: 9
		}
	});
	archive.pipe(output);
	archive.directory(path.join(p, "win-unpacked"), false);
	archive.finalize();
}
