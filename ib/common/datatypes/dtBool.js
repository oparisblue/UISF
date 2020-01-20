class DTBool extends DataType {
	
	constructor(value) {
		super(value);
	}
	
	getValue() {
		return this.value;
	}
	
	setValue(value) {
		this.value = !!value;
	}
	
	getInspector(field, comp) {
		let input = document.createElement("input");
		input.type = "checkbox";
		input.checked = this.value;
		input.addEventListener("click", ()=>{
			comp.setField(field, input.checked);
		});
		return input;
	}
	
	getIcon() {
		return `<i class="mdi mdi-alpha-b-box" style="color:#FF9800"></i>`;
	}
	
	getType() {
		return "Boolean";
	}
}