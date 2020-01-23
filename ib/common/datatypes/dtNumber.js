class DTNumber extends DataType {
	
	getValue() {
		return this.value;
	}
	
	setValue(value) {
		this.value = parseFloat(value);
	}
	
	getInspector(field, comp) {
		let input = document.createElement("input");
		input.type = "number";
		input.value = this.value;
		input.addEventListener("input", ()=>{
			comp.setField(field, new DTNumber(this.name, this.description, input.value, this.defaultValue, this.isInspectorEditable));
		});
		return input;
	}
	
	getIcon() {
		return `<i class="mdi mdi-alpha-n-box" style="color:#E91E63"></i>`;
	}
	
	getType() {
		return "Number";
	}
}