class DTNumber extends DataType {
	
	parseValue(value) {
		return parseFloat(value);
	}
	
	getInspector(field, comp) {
		let input = document.createElement("input");
		input.type = "number";
		input.value = this.value;
		input.addEventListener("input", ()=>{
			this.value = input.value;
			comp.setField(field, this.value);
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