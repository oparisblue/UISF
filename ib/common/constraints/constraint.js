class Constraint {
	constructor(screenSize) {
		this.screenSize = screenSize;
	}
	getType() { return ""; }
}

const Direction = {
	LEFT: "Left",
	RIGHT: "Right",
	TOP: "Top",
	BOTTOM: "Bottom"
}

const Axis = {
	HORIZONTAL: "X",
	VERTICAL: "Y"
}