class ComponentRandom extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.random = 0;
		
		this.fields = {
			MIN:    new DTNumber("Minimum", `The smallest random number to generate`, 0),
			MAX:    new DTNumber("Maximum", `The largest random number to generate`, 1),
			OUTPUT: new DTNumber("Output", `A random number ranging between the minimum and the maximum`, 0)
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = (Math.random() * (this.fields.MAX.value - this.fields.MIN.value)) + this.fields.MIN.value;
	}
	
	static getEditorInfo() {
		return {
			name: "Random",
			description: `Generates random numbers`
		}
	}
}

components.random = ComponentRandom;