class EVReduceMotion extends EnvironmentVariable {
	
	constructor(shouldBeTrue) {
		super();
		this.shouldBeTrue = shouldBeTrue;
	}
	
	toJSON() {
		return {name: "reduceMotion", shouldBeTrue: this.shouldBeTrue, properties: this.properties};
	}
	
	predicate() {
		return env.doReduceMotion && env.isReducedMotion;
	}
	
	compareTo(ev) {
		// Dark mode > !Dark Mode
		if (ev.constructor == EVReduceMotion && this.shouldBeTrue && !ev.shouldBeTrue) return 1;
		return 0;
	}
	
	getName() {
		return "Reduce Motion = " + (this.shouldBeTrue ? "true" : "false");
	}
	
	equiv(ev) {
		return ev.constructor == EVReduceMotion && ev.shouldBeTrue == this.shouldBeTrue;
	}
	
	getEmulationTitle() {
		 return `<div class="emuAccess">${this.getName()}</div>`;
	}
	
}

let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
reduceMotion.addListener(()=>{
	Environment.isReducedMotion = reduceMotion.matches;
	environmentHasChanged = true;
});
Environment.isReducedMotion = reduceMotion.matches;