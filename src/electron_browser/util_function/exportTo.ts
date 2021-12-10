import FileSaver from "file-saver";
export const toJSON = (name: string, data: any) => {
	FileSaver.saveAs(
		new Blob([JSON.stringify(data)], { type: "" }),
		`${name}.json`
	);
};
export const toTXT = (name: string, content: string) => {
	FileSaver.saveAs(
		new Blob([content], { type: "text/plain" }),
		`${name}.txt`
	);
};

export const toCSV = (name: string, array: Array<any>) => {
	const str =
		"\uFEFF" +
		array
			.map(e => {
				try {
					return e.join(",");
				} catch (error) {
					console.log(e);
				}
				return "";
			})
			.join("\n");
	FileSaver.saveAs(
		new Blob([str], { type: "text/plain;charset=utf-8" }),
		`${name}.csv`
	);
};
