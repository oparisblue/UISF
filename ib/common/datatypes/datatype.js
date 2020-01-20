class DataType {
	
	constructor(value) {
		this.setValue(value);
	}
	
	getValue() {}
	setValue() {}
	
	getInspector(_field, _comp) { return document.createElement("div"); }
	getIcon() { return ""; }
	getType() { return ""; }
}