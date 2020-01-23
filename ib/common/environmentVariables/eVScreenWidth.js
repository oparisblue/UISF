class EVScreenWidth extends EnvironmentVariable {
	
	constructor(size) {
		super();
		this.size = size;
	}
	
	predicate() {
		return env.doWidth && env.width < this.size;
	}
	
	compareTo(ev) {
		// Smaller screen sizes are better
		if (ev.constructor == EVScreenWidth) return this.size < ev.size ? 1 : -1;
		// Otherwise, we're the same as other elements
		return 0;
	}
	
	getName() {
		return "Screen Size < " + this.size;
	}
	
	equiv(ev) {
		return ev.constructor == EVScreenWidth && ev.size == this.size;
	}
	
	getEmulationTitle() {
		 return `<div class="emuScreenSize">${this.getName()}</div>`;
	}
	
}