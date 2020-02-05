class Equation extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.fields = {
			EQUATION: new DTString("Equation", "A math equation",           "", SHOW_IN_INSPECTOR),
			OUTPUT:   new DTNumber("Output",   "The reult of the equation", 0,  SHOW_IN_OUTLETS)
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = EquationParser.parseEquation(this.fields.EQUATION.getValue());
	}
	
	static getEditorInfo() {
		return {
			name: "Equation",
			description: "A custom equation that returns a number"
		}
	}
}

components.equation = Equation;