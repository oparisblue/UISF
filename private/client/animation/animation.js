/**
* Represents an animation which can be applied to a component.
* @author Orlando
*/
class Animation {
	/**
	* @param {number}duration How many frames the animation should take to complete.
	*/
	constructor(duration) {
		this.ticks = 0;
		this.duration = duration;
	}
	
	/**
	* Is the animation over?
	* @return {boolean} <code>true</code> if the animation is finished, <code>false</code> if it is still in progress.
	*/
	isDone() {
		return this.ticks >= this.duration;
	}
	
	/**
	* Called each frame of the animation.
	* @param  {string}css The existing CSS for the component to animate.
	* @param  {component}comp The component to animate.
	* @return {string} The new CSS, affected by the animation.
	*/
	onTick(css, _comp) {
		this.ticks++;
		// Override me!
		return css;
	}
}