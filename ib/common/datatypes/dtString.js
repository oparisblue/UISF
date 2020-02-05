class DTString extends DataType {
	
	parseValue(value) {
		let string = value + "";
		if (string[0] == "~") {
			let localSelector = string.slice(1);
			if (localise[lang] && localise[lang][localSelector]) return localise[lang][localSelector];
			else if (localise.en_nz[localSelector]) return localise.en_nz[localSelector];
			else return localSelector;
		}
		else return string;
	}
	
	getInspector(field, comp) {
		let input = document.createElement("input");
		input.type = "text";
		input.value = this.value;
		input.addEventListener("input", ()=>{
			this.value = input.value;
			comp.setField(field, this.value);
		});
		input.addEventListener("dragover", (e)=> {
			e.preventDefault(); e.stopPropagation();
		});
		input.addEventListener("drop", (e)=> {
			e.preventDefault(); e.stopPropagation();
			this.value = e.dataTransfer.getData("text");
			input.value = this.value;
			comp.setField(field, this.value);
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