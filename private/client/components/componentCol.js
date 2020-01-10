/**
* An empty component, used purely as a container for other elements.
* @author Simon Watson
*/
components["gridCol"] = class ComponentCol extends Component {
	
	constructor() {
		super(arguments);
		this.domNode = document.createElement("div");
		this.domNode.id = this.id;
		this.domNode.style.flex = 1;
		this.noCol = false;
	}
	
	/**
	* @override
	*/
	addChild(child) {
		let regFlex = /flex(\d+)/;
		
		for (let arg of child.args) {
			if (isString(arg)) {
				if (regFlex.test(arg)) this.domNode.style.flex = parseInt(regFlex.exec(arg)[1]);
				else if (arg.toLowerCase() == "nocol") { 
					this.noCol = true;
					return;
				}
			}
		}
		
		super.addChild(child);
	}
	
	/**
	* @override
	*/
	onTick() {
		if (this.noCol) this.remove();
		return this.doDefaultRender("");
	}
	
}