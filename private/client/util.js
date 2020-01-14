function isString(str) {
	return typeof str === "string" || str instanceof String;
}

/**
* The $ function returns an amount of HTML objects based off a passsed CSS selector.
* @param {string}ele The CSS selector of an HTML element for javascript to select.
* @return {any} Either an HTML object, an array of HTML objects or null
*/
function $(ele) {
	let result = document.querySelectorAll(ele);
	return result.length == 0 ? null : (result.length == 1 ? result[0] : result);
}

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function remap(val, initMin, initMax, newMin, newMax) {
	return (val - initMin) * (newMax - newMin) / (initMax - initMin) + newMin;
}