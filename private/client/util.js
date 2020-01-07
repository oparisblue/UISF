function isString(str) {
	return typeof str === "string" || str instanceof String;
}

function $(ele) {
	let result = document.querySelectorAll(ele);
	return result.length == 1 ? result[0] : result;
}