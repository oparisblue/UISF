/**
* Represents an animation which can be applied to a component.
* @author Orlando
*/
class Animation {
	
	/**
	* @param {number}duration How many milliseconds the animation should take to complete.
	*/
	constructor(duration) {
		this.ms = 0;
		this.duration = duration;
	}
	
	/**
	* Is the animation over?
	* @return {boolean} <code>true</code> if the animation is finished, <code>false</code> if it is still in progress.
	*/
	isDone() {
		return this.ms >= this.duration;
	}
	
	/**
	* Called when the animation is completed.
	*/
	onDone(element) {
		// Override me!
	}
	
	/**
	* Called each frame of the animation.
	* @param  {string}css The existing CSS for the component to animate.
	* @param  {component}comp The component to animate.
	* @return {string} The new CSS, affected by the animation.
	*/
	onTick(css, comp) {
		this.ms += Animation.deltaTime;
		return this.animate(css, comp);
	}
	
	animate(css, _comp) {
		// Override me!
		return css;
	}
}

/**
* An infinite animation. When it reaches the end of its duration, it resets its ellapsed milliseconds to 0.
*/
class AnimationInfinite extends Animation {
	constructor(duration) {
		super(duration);
	}
	
	/**
	* @override
	*/
	isDone() {
		if (this.ms >= this.duration) this.ms = 0;
		return false;
	}
}

/**
* The time (in ms) between this tick and the last tick.
*/
Animation.deltaTime = 0;

class Easing {
	static linear(x) {
		return x;
	}
	
	static easeIn(x) {
		return Math.pow(x, 1.675);
	}
	
	static easeOut(x) {
		return 1 - Math.pow(1 - x, 1.675);
	}
	
	static easeInOut(x) {
		return 0.5 * (Math.sin((x - .5) * Math.PI) + 1);
	}
	
	static bounceIn(x) {
		return (0.02 - (0.02 / x)) * Math.sin(25 * x) + 1;
	}
	
	static bounceOut(x) {
		return 0.02 * x / (--x) * Math.sin(25 * x);
	}
	
	static shake(x) {
		return Math.asin(Math.cos(x * 30)) * (1 - (x / 1));
	}
}