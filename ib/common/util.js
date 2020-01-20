function $(ele) {
	return document.querySelector(ele);
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