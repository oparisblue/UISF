class ComponentPI extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		const PI         = Math.PI;
		const TWO_PI     = PI * 2;
		const HALF_PI    = PI / 2;
		const QUARTER_PI = PI / 4;
		
		this.fields = {
			PI:         new DTNumber("PI",         `A constant value of ${PI}`,         PI,         SHOW_IN_OUTLETS),
			TWO_PI:     new DTNumber("Two PI",     `A constant value of ${TWO_PI}`,     TWO_PI,     SHOW_IN_OUTLETS),
			HALF_PI:    new DTNumber("Half PI",    `A constant value of ${HALF_PI}`,    HALF_PI,    SHOW_IN_OUTLETS),
			QUARTER_PI: new DTNumber("Quarter PI", `A constant value of ${QUARTER_PI}`, QUARTER_PI, SHOW_IN_OUTLETS),
		};
		
		this.build();
	}
	
	static getEditorInfo() {
		return {
			name: "PI",
			description: `A constant representing different values of PI`
		}
	}
}

class ComponentTrue extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		const TRUE = true;
		
		this.fields = {
			TRUE: new DTBool("True", `A constant value of ${TRUE}`, TRUE, SHOW_IN_OUTLETS)
		};
		
		this.build();
	}
	
	static getEditorInfo() {
		return {
			name: "True",
			description: `A constant representing the boolean True`
		}
	}
}

class ComponentFalse extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		const FALSE = false;
		
		this.fields = {
			FALSE: new DTBool("False", `A constant value of ${FALSE}`, FALSE, SHOW_IN_OUTLETS)
		};
		
		this.build();
	}
	
	static getEditorInfo() {
		return {
			name: "False",
			description: `A constant representing the boolean False`
		}
	}
}

class ComponentPositiveInfinity extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		const POSITIVE_INFINITY = Infinity;
		
		this.fields = {
			POSITIVE_INFINITY: new DTNumber("Positive Infinity", `A constant value of ${POSITIVE_INFINITY}`, POSITIVE_INFINITY, SHOW_IN_OUTLETS)
		};
		
		this.build();
	}
	
	static getEditorInfo() {
		return {
			name: "Positive Infinity",
			description: `A constant representing +Infinity`
		}
	}
}

class ComponentNegitiveInfinity extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		const NEGITIVE_INFINITY = -Infinity;
		
		this.fields = {
			NEGITIVE_INFINITY: new DTNumber("Negitive Infinity", `A constant value of ${NEGITIVE_INFINITY}`, NEGITIVE_INFINITY, SHOW_IN_OUTLETS)
		};
		
		this.build();
	}
	
	static getEditorInfo() {
		return {
			name: "Negitive Infinity",
			description: `A constant representing -Infinity`
		}
	}
}

components.pi               = ComponentPI;
components.true             = ComponentTrue;
components.false            = ComponentFalse;
components.positiveInfinity = ComponentPositiveInfinity;
components.negitiveInfinity = ComponentNegitiveInfinity;