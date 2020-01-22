class DTString extends DataType {
	
	constructor(name, description, value, defaultValue = null) {
		super(name, description, value, defaultValue);
	}
	
	getValue() {
		return this.value;
	}
	
	setValue(value) {
		this.value = value + "";
	}
	
	getInspector(field, comp) {
		let input = document.createElement("input");
		input.type = "text";
		input.value = this.value;
		input.addEventListener("input", ()=>{
			comp.setField(field, new DTString(this.name, this.description, input.value, this.defaultValue));
		});
		return input;
	}
	
	getIcon() {
		return `<i class="mdi mdi-alpha-s-box" style="color:#03A9F4"></i>`;
	}
	
	getType() {
		return "String";
	}
}