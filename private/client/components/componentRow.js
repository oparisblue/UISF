/**
* An empty component, used purely as a container for other elements.
* @author Orlando
*/
components["gridRow"] = class ComponentRow extends Component {
	
	constructor() {
		super(arguments);
		this.domNode = document.createElement("div");
		this.domNode.classList.add("gridRow");
		this.domNode.id = this.id;
	}
	
	/**
	* @override
	*/
	onTick() {
		let css = `
			.gridRow {
				width: 100%;
				display: flex;
				justify-content: space-between;
			}
		`;
		return this.doDefaultRender(css);
	}
	
}