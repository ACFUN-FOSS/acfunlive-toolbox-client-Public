import FileSaver from "file-saver";
export const toJSON = (name: string, data: any) => {
	FileSaver.saveAs(
		new Blob([JSON.stringify(data)], { type: "" }),
		`${name}.json`
	);
};
export const toTXT = (name: string, content: string) => {
	FileSaver.saveAs(content, `${name}.txt`);
};
