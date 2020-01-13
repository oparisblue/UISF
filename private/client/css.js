function getDefaultCSS() {
	return `
	button, input[type="checkbox"], input[type="radio"] {
		-webkit-appearance:none;
		-moz-appearance:none;
		-ms-appearance:none;
		appearance:none;
		min-height:22px;
		min-width:22px;
		font-family:${Constants.FONT_FAMILLY}
		background-color:${getColour(3)};
		border-radius:5px;
		outline:none;
		border-style:none;
		border-top:solid 1px ${getColour(4)};
		cursor:pointer;
		margin:5px;
		color:${Constants.DARK.TEXT};
		font-size:0.8em;
		box-shadow:0 2px 10px rgba(0, 0, 0, 0.1);
		user-select:none;
		text-align:center;
		position:relative;
	}
	
	button:active, .buttonDefault, input[type="checkbox"]:checked, input[type="checkbox"]:indeterminate, input[type="radio"]:checked {
		background-color:${getAccentColour()};
		border-top-color:${getAccentHighlight()};
	}
	.buttonDefault:active, input[type="checkbox"]:active, input[type="radio"]:active {
		filter:brightness(115%);
	}
	
	:focus {
		box-shadow:0 2px 10px rgba(0, 0, 0, 0.1), 0 0 0 4px ${getAccentColour()}88;
	}
	`;	
}