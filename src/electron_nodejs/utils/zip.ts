const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const unzip = require("unzipper");

export const zipTo = (dir: string, zipDir: string) => {
	fs.mkdirSync(path.dirname(zipDir), { recursive: true });
	return new Promise(resolve => {
		try {
			fs.unlinkSync(zipDir);
		} catch (error) {}
		const output = fs.createWriteStream(zipDir);
		const archive = archiver("zip", {
			zlib: { level: 9 }
		});
		archive.on("end", () => {
			resolve(zipDir);
		});
		archive.pipe(output);
		archive.directory(dir, false);
		archive.finalize();
	});
};

export const zipFrom = (zipDir: string, dir: string) => {
	fs.mkdirSync(path.dirname(dir), { recursive: true });
	return new Promise((resolve, reject) => {
		fs.createReadStream(zipDir)
			.pipe(unzip.Extract({ path: dir }))
			.on("finish", resolve)
			.on("error", reject);
	});
};
