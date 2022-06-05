export default () => {
	return {
		config: {
			owner: false,
			degree: true,
			name: true,
			preview: 1,
			color: [
				{
					level: 0,
					color: "rgba(5, 214, 124, 1)"
				},
				{
					level: 3,
					color: "rgba(25, 175, 239, 1)"
				},
				{
					level: 6,
					color: "rgba(249, 164, 0, 1)"
				},
				{
					level: 9,
					color: "rgba(230, 72, 69, 1)"
				},
				{
					level: 12,
					color: "rgba(178, 48, 242, 1)"
				}
			]
		},
		style: {
			verticalAlign: "middle",
			position: "",
			paddingLeft: 0,
			paddingRight: 0,
			paddingTop: 0,
			paddingBottom: 0,
			marginLeft: 0,
			marginRight: 8,
			marginTop: 0,
			marginBottom: 0,
			specificBackgroundColor: false,
			backgroundColor: "transparent",
			borderRadius: 4,
			borderWidth: 2,
			borderColor: "rgba(232, 221, 7, 1)"
		},
		degreeStyle: {
			verticalAlign: "top",
			position: "relative",
			font: "/fonts/极影毁片圆.ttf",
			fontSize: 13,
			fontWeight: "bold",
			specificColor: true,
			color: "#fff",
			fontStyle: "normal",
			textDecoration: "none",
			textShadowWidth: 1,
			textShadowColor: "#000",
			paddingLeft: 5,
			paddingRight: 4,
			paddingTop: -1,
			paddingBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			marginTop: 0,
			marginBottom: 0,
			backgroundColor: "rgba(232, 221, 7, 1)",
			borderRadius: 0,
			borderWidth: 0,
			borderColor: "#000"
		},
		nameStyle: {
			verticalAlign: "bottom",
			position: "不定位",
			font: "/fonts/极影毁片圆.ttf",
			fontSize: 13,
			fontWeight: "normal",
			specificColor: true,
			color: "#fff",
			fontStyle: "normal",
			textDecoration: "none",
			textShadowWidth: 1.2,
			textShadowColor: "#000",
			paddingLeft: 0,
			paddingRight: 0,
			paddingTop: 0,
			paddingBottom: 0,
			marginLeft: 4,
			marginRight: 7,
			marginTop: 0,
			marginBottom: 0,
			specificBackgroundColor: true,
			backgroundColor: "rgba(255,255,255,0)",
			borderRadius: 0,
			borderWidth: 0,
			borderColor: "#000"
		}
	};
};
