/**
* <p>Represents a component which is drawn on the page.</p>
* <p><strong>NOTE:</strong> this is an abstract class! Override Component to do anything useful.</p>
* @author Orlando
*/
class Component {
	
	static nextID = 0;
	
	constructor() {
		this.animations = [];
		this.children = [];
		this.domNode = null;
		this.canHaveChildren = true;
		
		this.id = "comp" + (Component.nextID++);
		this.data = ``;
		
		if (arguments[0].length >= 1) {
			for (let arg of arguments[0]) {
				if (arg.constructor == CompData) this.data = arg.data;
				else if (arg[0] == "#")          this.id   = arg.slice(1);
			}
		}
		
		// super call then actually create the dom node...
	}
	
	/**
	* Add a child to the component. Note that some elements cannot have children (e.g. labels).
	* @param {component}child The child to add.
	*/
	addChild(child) {
		if (child == null) return;
		if (!this.canHaveChildren) throw new Error("Can't add a child to this element!");
		this.children.push(child);
		this.domNode.appendChild(child.getDOMNode());
	}
	
	/**
	* Remove this component from the given list of components (and remove its DOM node)
	* @param {list}list Optional. The list to remove the component from. If not provided, defaults to the global list of components.
	*/
	remove(list = null) {
		if (list == null) {
			this.domNode.remove();
			list = activeComponents;
		}
		for (let i = list.length - 1; i >= 0; i--) {
			if (list[i] == this) list.splice(i, 1);
			else                 this.remove(list[i].children); // Recursive call
		}
	}
	
	/**
	* Do we have an argument with the given name?
	* @param  {string}name The name of the argument. Note arguments are case-insensitive.
	* @param  {array}args All of the arguments.
	* @return {boolean} <code>true</code> if we have it, <code>false</code> if we do not.
	*/
	hasArg(name, args) {
		for (let arg of args) {
			if (isString(arg) && arg.toLowerCase() == name.toLowerCase()) return true;
		}
		return false;
	}
	
	/**
	* Get the DOM Node represented by this component.
	*/
	getDOMNode() {
		return this.domNode;
	}
	
	/**
	* Apply all active animations to this component, and remove animations which have finished.
	* Also, tick all of this elements children.
	* <strong>Note:</strong> this will be called in the onTick() method of each component - don't call if you're not a component!
	* @param  {string}css The currently generated CSS code
	* @return {string} The updated CSS code
	*/
	doDefaultRender(css) {
		// Animations on this element
		for (let i = this.animations.length - 1; i >= 0; i--) {
			css = this.animations[i].onTick(css, this);
			// Remove an animation which has finished
			if (this.animations[i].isDone()) this.animations.splice(i, 1);
		}
		
		// Tick children
		for (let child of this.children) css += child.onTick();
		
		return css;
	}
	
	/**
	* Called every render tick. Lots should happen here:
	* <ul>
	* 	<li>Update the component to represent the current state.</li>
	*   <li>Re-generate the CSS for the component to account for width, height, etc.</li>
	*   <li>Apply animations to the component (call <code>applyAnimations(css)</code> if overriding).</li>
	* </ul>
	* @returns {string} CSS for the component.
	*/
	onTick() {
		return "";
	}
	
}

/**
* Represents a data string (e.g. data for a label, etc). Used to differentiate between these inputs and normal properties.
* @author Orlando
*/
class CompData {
	
	/**
	* @param {string}data The data to hold.
	*/
	constructor(data) {
		this.data = data;
	}
	
}