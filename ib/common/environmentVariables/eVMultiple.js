class EVMultiple extends EnvironmentVariable {
	
	constructor(others) {
		super();
		this.others = others;
	}
	
	predicate() {
		// Are all of the other predicates true?
		return this.others.reduce((acc, val)=>acc && val.predicate(), true);
	}
	
	compareTo(ev) {
		// Get the maximum order value
		return this.others.reduce((acc, val)=>Math.max(acc, val.compareTo(ev)), -1);
	}
	
	getName() {
		// Join all the names together (e.g. implode)
		return this.others.reduce((acc, val)=>acc + val + ", ", "").slice(0, -2);
	}
	
	equiv(ev) {
		// Check that the other one contains all of the same variables
		if (ev.constructor == EVMultiple && ev.others.length == this.others.length) {
			for (let ele of ev.others) {
				for (let i = 0; i < this.others; i++) {
					if (!toTest[i].equiv(ele)) return false;
				}
			}
			return true;
		}
		return false;
	}
	
	getEmulationTitle() {
		 return this.others.reduce((acc, val)=>acc + val.getEmulationTitle(), ``);
	}
	
}