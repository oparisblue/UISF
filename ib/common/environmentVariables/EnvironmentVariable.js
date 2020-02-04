class EnvironmentVariable {
	
	constructor() {
		// Format "name": {"value": "some name", "type":"field"}
		this.properties = {};
	}
	
	// Abstract methods
	
	/**
	* Returns a representation of this environment variable and its properties
	* e.g. the name of the variable, and any associated data
	*/
	toJSON() {
		return {};
	}
	
	/**
	* Should this variable be applied - e.g. does it match the current environment?
	* @return <code>true</code> = should apply, <code>false</code> = don't apply.
	*/
	predicate() {
		return true;
	}
	
	/**
	* Is this environment variable more important than another environment variable?
	* @return -1 = less important, 0 = same, 1 = more important
	*/
	compareTo(_ev) {
		return 0;
	}
	
	/**
	* @return A name representing this environment variable.
	*/
	getName() {
		return "";
	}
	
	/**
	* Is this environment variable the same as another one?
	*/
	equiv(_ev) {
		return false;
	}
	
	/**
	* @return The HTML which represents this element on the "emulate" button in the editor.
	*/
	getEmulationTitle() {
		return ``;
	}
	
	// Concrete
	
	addProperty(name, type, value) {
		this.properties[name] = {
			type: type,
			value: value
		};
	}
	
	/**
	* Apply this environment variable to the given list, only if its predicate is true, and only adding elements or replacing existing ones where where compareTo >= 1.
	* Note that replacing when compareTo == 0 is a warning.
	*/
	applyTo(lst) {
		// The environment is not in the correct state, don't do anything
		if (!this.predicate()) return;
		
		// All of the properties we have let to try and apply
		let remainingProps = Object.keys(this.properties);
		
		// Replace existing properties (if any) if we are more important than the previous property
		for (let i = 0; i < lst.length; i++) {
			let canReplace = this.compareTo(lst[i].ev);
			if (canReplace >= 0 && remainingProps.includes(lst[i].name)) {
				// if (canReplace == 0)
				// 	console.warn(`Conflicting Environment Variables ${this.getName()} and ${lst[i].ev.getName()} for ${lst[i].type} ${lst[i].name}, using value ${this.properties[lst[i].name].value}`);
				lst[i].value = this.properties[lst[i].name].value;
			}
		}
		
		// Add new properties to the list
		for (let k of remainingProps) {
			let prop = this.properties[k];
			lst.push({
				name:  k,
				value: prop.value,
				type:  prop.type,
				ev:    this
			});
		}
	}
	
}