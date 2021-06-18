export const isElectron = (): boolean => {
	return Boolean(window && window.process && window.process.type);
};
