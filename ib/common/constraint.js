class Constraint {
	
	static align(direction, alignTo, constant) {
		return {"type": "align" + direction, "direction": direction, "alignTo": alignTo, "constant": constant};
	}
	
	static center(axis) {
		return {"type": "center" + axis, "axis": axis};
	}
	
	static width(width) {
		return {"type": "width", "width": width};
	}
	
	static height(height) {
		return {"type": "height", "height": height};
	}
	
	static invisible(invisible) {
		return {"type": "invisible", "invisible": invisible};
	}
		
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