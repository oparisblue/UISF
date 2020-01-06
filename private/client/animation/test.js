class AnimationTest extends Animation {
	
	constructor() {
		super(100);
	}
	
	/**
	* @override
	*/
	onTick(css, comp) {
		super.onTick();
		return css += `#${comp.id}{position:absolute;opacity:${this.ticks/100};}`;
	}
	
}