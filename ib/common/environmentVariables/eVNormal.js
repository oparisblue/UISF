class EVNormal extends EnvironmentVariable {
	
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