class DataType {
	
	constructor(name, description, value, defaultValue = null) {
		this.name = name;
		this.description = description;
		this.setValue(value);
		this.defaultValue = defaultValue == null ? value : defaultValue;
	}
	
	getValue() {}
	setValue() {}
	
	resetToDefault() {
		this.setValue(this.defaultValue);
	}
	
	getInspector(_field, _comp) { return document.createElement("div"); }
	getIcon() { return ""; }
	getType() { return ""; }
}