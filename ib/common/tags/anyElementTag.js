/**
* The any element tag
* @author Simon Watson
*/

class AnyElementTag extends Tag {
	constructor(name) {
		super(name);
	}
	
	static getName() {
		return "Basic Tag";
	}
	
	static getMaxPerElement() {
		return -1;
	}
}

Tag.tagTypes["AnyElementTag"] = AnyElementTag;