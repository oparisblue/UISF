/**
* The $ function returns an amount of HTML objects based off a passsed CSS selector.
* @param {string}ele The CSS selector of an HTML element for javascript to select.
* @return {any} Either an HTML object, an array of HTML objects or null
*/
function $(ele) {
	let result = document.querySelectorAll(ele);
	return result.length == 0 ? null : (result.length == 1 ? result[0] : result);
}

function toggleClass(ele, cls, bool) {
	if (bool) ele.classList.add(cls);
	else ele.classList.remove(cls);
}

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}