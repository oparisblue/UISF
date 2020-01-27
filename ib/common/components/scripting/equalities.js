class ComponentEquals extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.fields = {
			INPUT_ONE: new DTNumber("Input One", `The first input. Default 0`, 0, 0, true),
			INPUT_TWO: new DTNumber("Input Two", `The second input. Default 1`, 1, 1, true),
			OUTPUT: new DTBool("Output", `Returns true or false depending on Input One and Two`, false, false, false)
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = this.fields.INPUT_ONE.value == this.fields.INPUT_TWO.value;
	}
	
	static getEditorInfo() {
		return {
			name: "Equal To",
			description: `Checks if Input One is equal to Input Two`
		}
	}
}

class ComponentNotEquals extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.fields = {
			INPUT_ONE: new DTNumber("Input One", `The first input. Default 0`, 0, 0, true),
			INPUT_TWO: new DTNumber("Input Two", `The second input. Default 1`, 0, 0, true),
			OUTPUT: new DTBool("Output", `Returns true or false depending on Input One and Two`, false, false, false)
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = this.fields.INPUT_ONE.value != this.fields.INPUT_TWO.value;
	}
	
	static getEditorInfo() {
		return {
			name: "Not Equal To",
			description: `Checks if Input One is not equal to Input Two`
		}
	}
}

class ComponentGreater extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.fields = {
			INPUT_ONE: new DTNumber("Input One", `The first input. Default 0`, 0, 0, true),
			INPUT_TWO: new DTNumber("Input Two", `The second input. Default 1`, 1, 1, true),
			OUTPUT: new DTBool("Output", `Returns true or false depending on Input One and Two`, false, false, false)
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = this.fields.INPUT_ONE.value > this.fields.INPUT_TWO.value;
	}
	
	static getEditorInfo() {
		return {
			name: "Greater Than",
			description: `Checks if Input One is greater than Input Two`
		}
	}
}

class ComponentGreaterEqual extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.fields = {
			INPUT_ONE: new DTNumber("Input One", `The first input. Default 0`, 0, 0, true),
			INPUT_TWO: new DTNumber("Input Two", `The second input. Default 1`, 1, 1, true),
			OUTPUT: new DTBool("Output", `Returns true or false depending on Input One and Two`, false, false, false)
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = this.fields.INPUT_ONE.value >= this.fields.INPUT_TWO.value;
	}
	
	static getEditorInfo() {
		return {
			name: "Greater Than or Equal To",
			description: `Checks if Input One is greater than or equal to Input Two`
		}
	}
}

class ComponentLess extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.fields = {
			INPUT_ONE: new DTNumber("Input One", `The first input. Default 1`, 1, 1, true),
			INPUT_TWO: new DTNumber("Input Two", `The second input. Default 0`, 0, 0, true),
			OUTPUT: new DTBool("Output", `Returns true or false depending on Input One and Two`, false, false, false)
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = this.fields.INPUT_ONE.value < this.fields.INPUT_TWO.value;
	}
	
	static getEditorInfo() {
		return {
			name: "Less Than",
			description: `Checks if Input One is less than Input Two`
		}
	}
}

class ComponentLessEqual extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.fields = {
			INPUT_ONE: new DTNumber("Input One", `The first input. Default 1`, 1, 1, true),
			INPUT_TWO: new DTNumber("Input Two", `The second input. Default 0`, 0, 0, true),
			OUTPUT: new DTBool("Output", `Returns true or false depending on Input One and Two`, false, false, false)
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = this.fields.INPUT_ONE.value <= this.fields.INPUT_TWO.value;
	}
	
	static getEditorInfo() {
		return {
			name: "Less Than or Equal To",
			description: `Checks if Input One is less than or equal to Input Two`
		}
	}
}

components.equals       = ComponentEquals;
components.notEequals   = ComponentNotEquals;
components.greater      = ComponentGreater;
components.greaterEqual = ComponentGreaterEqual;
components.less         = ComponentLess;
components.lessEqual    = ComponentLessEqual;