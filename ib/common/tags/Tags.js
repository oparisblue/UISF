/**
* Adds the Tag class;
* @author Simon Watson
*/

class Tag {
	constructor(name) {
		this.name = name;
		this.id = Tag.nextTagId++;
		Tag.tags[this.id] = this;
	}
	
	getColour() {
		return "";
	}
	
	getIcon() {
		return "";
	}
	
	static getMaxPerElement() {
		return -1;
	}
}

Tag.tags = {};
Tag.nextTagId = 0;

Tag.tagTypes = {};