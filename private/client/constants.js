/**
* Settings constants
* @author Simon Watson
*/

const Constants = {
	DARK: {
		BACKGROUND: [
			"#", // Darkest
			"",
			"",
			"",
			"", // Lightest
		],
		TEXT: "",
	},
	LIGHT: {
		BACKGROUND: [
			"", // Darkest
			"",
			"",
			"",
			"", // Lightest
		],
		TEXT: "",
	},
	BORDER_RADIUS: "",
	REDUCE_MOTION: false,
	UI_SIZE: 1, // 0.5 = small, 1 = normal, 2 = large
	FONT_FAMILY: "Trebuchet MS",
};

function getColour(value) {
	return Constants[window.matchMedia("(prefers-color-scheme: dark)") ? "DARK" : "LIGHT"].BACKGROUND[value];
}

function getAccentColour() {
	
}

function getAccentHighlight() {
	
}
