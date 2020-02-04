class DTAny extends DataType {
	
	parseValue(value) {
		return value;
	}
	
	getInspector(field, comp) {
		let input = document.createElement("input");
		input.type = "text";
		input.value = this.value;
		input.addEventListener("input", ()=>{
			this.value = input.value;
			comp.setField(field, this.value);
		});
		return input;
	}
	
	getIcon() {
		return `<i class="mdi mdi-alpha-a-box" style="color:#009688"></i>`;
	}
	
	getType() {
		return "String";
	}
}