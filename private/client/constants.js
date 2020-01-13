/**
* Settings constants
* @author Simon Watson
*/

const Constants = {
	DARK: {
		BACKGROUND: [
			"#212121", // Darkest
			"#424242",
			"#616161",
			"#757575",
			"#9E9E9E", // Lightest
		],
		TEXT: "#FFFFFF",
	},
	LIGHT: {
		BACKGROUND: [
			"#FFFFFF", // Darkest (White)
			"#FAFAFA",
			"#F5F5F5",
			"#EEEEEE",
			"#E0E0E0", // Lightest (Darker White)
		],
		TEXT: "#000000",
	},
	BORDER_RADIUS: "8px",
	REDUCE_MOTION: false,
	UI_SIZE: 1, // 0.5 = small, 1 = normal, 2 = large
	FONT_FAMILY: "Trebuchet MS",
};

function getColour(value) {
	return Constants[window.matchMedia("(prefers-color-scheme: dark)").matches ? "DARK" : "LIGHT"].BACKGROUND[value];
}

function getAccentColour() {
	return "#f44336";
}

function getAccentHighlight() {
	return "#ef9a9a";
}

function getAccentShadow() {
	return "#d32f2f";
}