class EVDarkMode extends EnvironmentVariable {
	
	constructor(shouldBeTrue) {
		super();
		this.shouldBeTrue = shouldBeTrue;
	}
	
	toJSON() {
		return {name: "darkMode", shouldBeTrue: this.shouldBeTrue, properties: this.properties};
	}
	
	predicate() {
		return env.doDarkMode && env.isDarkMode;
	}
	
	compareTo(ev) {
		// Dark mode > !Dark Mode
		if (ev.constructor == EVDarkMode && this.shouldBeTrue && !ev.shouldBeTrue) return 1;
		return 0;
	}
	
	getName() {
		return "Dark Mode = " + (this.shouldBeTrue ? "true" : "false");
	}
	
	equiv(ev) {
		return ev.constructor == EVDarkMode && ev.shouldBeTrue == this.shouldBeTrue;
	}
	
	getEmulationTitle() {
		 return `<div class="emuAccess">${this.getName()}</div>`;
	}
	
}

let darkMode = window.matchMedia("(prefers-color-scheme: dark)");
darkMode.addListener(()=>{
	Environment.isDarkMode = darkMode.matches;
	environmentHasChanged = true;
});
Environment.isDarkMode = darkMode.matches;