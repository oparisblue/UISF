class EVNormal extends EnvironmentVariable {
	
	toJSON() {
		return {name: "normal", properties: this.properties};
	}
	
	compareTo(_ev) {
		return -1;
	}
	
	getName() {
		return "Normal";
	}
	
	equiv(ev) {
		return ev.constructor == EVNormal;
	}
	
	getEmulationTitle() {
		 return `<div class="emuTitle">none</div>`;
	}
	
}

const NORMAL_TYPE = new EVNormal();