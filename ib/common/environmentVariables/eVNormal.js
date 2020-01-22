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
	
}

const NORMAL_TYPE = new EVNormal();