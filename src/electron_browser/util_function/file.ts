import { randomId } from "./base";
export const load = (filetype = "*") => {
	return new Promise(resolve => {
		const id = `file-${randomId()}`;
		const fileEle = document.createElement("input");
		fileEle.type = "file";
		fileEle.accept = filetype;
		fileEle.click();
		document.body.onfocus = () => {
			document.body.onfocus = null;

			fileEle.onchange = () => {
				// @ts-ignore
				const file = fileEle.files[0];
				fileEle.remove();
				if (file) {
					resolve(file);
				} else {
					resolve(false);
				}
			};
			setTimeout(() => {
				fileEle.remove();
				resolve(false);
			}, 5000);
		};
	});
};

export const loadAsText = (fileType = "*") => {
	return new Promise((resolve, reject) => {
		load(fileType)
			.then((file: any) => {
				const reader = new FileReader();
				reader.onload = (e: any) => {
					resolve(reader.result);
				};
				reader.readAsText(file);
			})
			.catch(reject);
	});
};
