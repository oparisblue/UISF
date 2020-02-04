const SHOW_IN_INSPECTOR = 1;
const SHOW_IN_INLETS    = 2;
const SHOW_IN_OUTLETS   = 4;

class DataType {
	
	constructor(name, description, value, visibility = 7) {
		this.name = name;
		this.description = description;
		this.setValue(value);
		this.defaultValue = value;
		this.visibility = visibility;
	}
	
	showInInspector() { return (SHOW_IN_INSPECTOR & this.visibility) > 0; }
	showInInlets()    { return (SHOW_IN_INLETS    & this.visibility) > 0; }
	showInOutlets()   { return (SHOW_IN_OUTLETS   & this.visibility) > 0; }
	
	getValue() {
		return this.value;
	}
	
	setValue(value) {
		this.value = this.parseValue(value);
	}
	
	parseValue(value) {
		return value;
	}
	
	resetToDefault() {
		this.value = this.defaultValue;
	}
	
	getInspector(_field, _comp) { return document.createElement("div"); }
	getIcon() { return ""; }
	getType() { return ""; }
}