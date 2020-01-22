class EVWire extends EnvironmentVariable {
	
	compareTo(_ev) {
		return 1;
	}
	
	getName() {
		return "Wire";
	}
	
	equiv(ev) {
		return ev.constructor == EVWire;
	}
	
}

const WIRE_TYPE = new EVWire();