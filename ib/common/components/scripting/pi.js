class ComponentPI extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		const PI         = Math.PI;
		const TWO_PI     = PI * 2;
		const HALF_PI    = PI / 2;
		const QUARTER_PI = PI / 4;
		
		this.fields = {
			PI:        new DTNumber("PI",         `A constant value of ${PI}`, PI, null, false),
			twoPi:     new DTNumber("Two PI",     `A constant value of ${TWO_PI}`, TWO_PI, null, false),
			halfPI:    new DTNumber("Half PI",    `A constant value of ${HALF_PI}`, HALF_PI, null, false),
			quarterPI: new DTNumber("Quarter PI", `A constant value of ${QUARTER_PI}`, QUARTER_PI, null, false),
		};
		
		this.build();
	}
	
	static getEditorInfo() {
		return {
			name: "PI",
			description: `A constant representing different values of PI.`
		}
	}
	
}
components.pi = ComponentPI;