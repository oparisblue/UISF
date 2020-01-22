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
	
	/**
	* @WARNING: You must include this in any new tag that extends this class.
	* @return {num} -1 for an unlimated amount
	* @return {num} >= 1 for a limated amount
	*/
	// static getMaxPerElement() {
	// 	return -1;
	// }
	
	getIcon() {
		return '';
	}
}

Tag.tags = {};
Tag.nextTagId = 0;

Tag.tagTypes = {};
