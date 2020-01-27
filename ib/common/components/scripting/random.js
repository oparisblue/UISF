class ComponentRandom extends ScriptingComponent {
	
	constructor(x, y) {
		super(x, y);
		
		this.random = (Math.random() * (1 - 0)) + 0;
		
		this.fields = {
			INPUT_ONE: new DTNumber("Input One", `The first input. Default 0`, 0, 0, true),
			INPUT_TWO: new DTNumber("Input Two", `The second input. Default 1`, 1, 1, true),
			OUTPUT: new DTNumber("Output", `A random number bewteen Input One and Input Two`, 0, 0, false)
		};
		
		this.build();
	}
	
	/**
	* @override
	*/
	onTick() {
		this.fields.OUTPUT.value = (Math.random() * (this.fields.INPUT_TWO.value - this.fields.INPUT_ONE.value)) + this.fields.INPUT_ONE.value;
	}
	
	static getEditorInfo() {
		return {
			name: "Random",
			description: `A random number every tick`
		}
	}
}

components.random = ComponentRandom;