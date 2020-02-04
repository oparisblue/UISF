class Math extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.fields = {
			EQUATION: new DTString("Equation", "A math equation", null , null, true),
			OUTPUT: new DTNumber("Output", "The reult of the equation", null, null, false),
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = EquationParser.parseEquation(this.fields.EQUATION);
	}
	
	static getEditorInfo() {
		return {
			name: "Equation",
			description: "A custom equation that returns a number"
		}
	}
}

components.math = Math;