/**
* An empty component, used purely as a container for other elements.
* @author Orlando
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
		let reg = /flex(\d+)/;
		for (let arg of child.args) {
			if (isString(arg)) {
				if (reg.test(arg)) this.domNode.style.flex = parseInt(reg.exec(arg)[1]);
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