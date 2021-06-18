export const listenDpi = (cb: any) => {
	const pr = window.devicePixelRatio;
	cb(pr);
	matchMedia(`(resolution: ${pr}dppx)`).addEventListener(
		"change",
		() => {
			listenDpi(cb);
		},
		{
			once: true
		}
	);
};
