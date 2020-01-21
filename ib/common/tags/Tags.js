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
		return '';
	}
	
	getMaxPerElemenet() {
		return -1;
	}
	
	getIcon() {
		return '';
	}
}

Tag.tags = {};
Tag.nextTagId = 0;