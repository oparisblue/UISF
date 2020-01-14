class BasicAnimation extends Animation {
	
	constructor(json) {
		super(json.hasOwnProperty("duration") ? json.duration : 1000);
		this.json = json;
		this.timingFunc = this.json.hasOwnProperty("timingFunc") ? this.json.timingFunc : Easing.linear;
		this.reverse = this.json.hasOwnProperty("reverse") ? this.json.reverse : false;
		
		let animations = ["fade", "shake", "slide", "pop"];
		
		if (!this.json.hasOwnProperty("animation") || !animations.includes(this.json.animation.toLowerCase())) {
			throw new Error("Animation not one of " + animations + "!");
		}
		
		this.json.animation = this.json.animation.toLowerCase();
		
		if (this.json.animation == "shake") {
			this.json.left = 0;
		}
	}
	
	animate(css, comp) {
		
		css += `#${comp.id} {`;
			
		let num = Math.abs((this.reverse ? 1 : 0) - this.timingFunc(this.ms / this.duration));
		console.log(this.json.animation)
		switch (this.json.animation) {
			case "fade" :
				css += `opacity: ${num} !important;`;
				break;
			case "slide" :
				css += `${this.json.axis}: ${this.json.from + ((this.json.to - this.json.from) * num)}px !important;`;
				break;
			case "pop" :
				css += `transform: scale(${this.json.from + ((this.json.to - this.json.from) * num)});`;
				break;
			case "shake" :
				this.json.left += 40 * Easing.shake(remap(this.ms / this.duration, 0, 1, 0.209, 0.89));
				css += `left: ${this.json.from + this.json.left}px !important;`;
				break;
		}
		
		return css + `}`;
	}
	
}