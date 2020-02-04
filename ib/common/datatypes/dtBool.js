class DTBool extends DataType {
	
	parseValue(value) {
		return !!value;
	}
	
	getInspector(field, comp) {
		let input = document.createElement("input");
		input.type = "checkbox";
		input.checked = this.value;
		input.addEventListener("click", ()=>{
			this.value = input.checked;
			comp.setField(field, this.value);
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