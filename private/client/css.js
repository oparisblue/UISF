function getDefaultCSS() {
	return `
	
	body, html {
		height:100%;
		padding:0;
		margin:0;
		font-family:"Trebuchet MS";
		box-sizing:border-box;
		overflow:hidden;
		background-color:${getColour(0)};
		color:${getTextColour()};
		user-select:none;
	}
	
	button, input[type="checkbox"], input[type="radio"] {
		-webkit-appearance:none;
		-moz-appearance:none;
		-ms-appearance:none;
		appearance:none;
		min-height:22px;
		min-width:22px;
		font-family:${Constants.FONT_FAMILY};
		background-color:${getColour(3)};
		border-radius:5px;
		outline:none;
		border-style:none;
		border-top:solid 1px ${getColour(4)};
		cursor:pointer;
		margin:5px;
		color:${getTextColour()};
		font-size:0.8em;
		box-shadow:0 2px 10px rgba(0, 0, 0, 0.1);
		user-select:none;
		text-align:center;
		position:relative;
	}
	
	button:active, .buttonDefault, input[type="checkbox"]:checked, input[type="checkbox"]:indeterminate, input[type="radio"]:checked {
		background-color:${getAccentColour()};
		border-top-color:${getAccentHighlight()};
		color:${Constants.DARK.TEXT};
	}
	.buttonDefault:active, input[type="checkbox"]:active, input[type="radio"]:active {
		filter:brightness(115%);
	}
	
	:focus {
		box-shadow:0 2px 10px rgba(0, 0, 0, 0.1), 0 0 0 4px ${getAccentColour()}44;
	}
	
	:disabled {
		opacity:0.5;
		cursor:default;
		pointer-events:none;
	}
	`;	
}