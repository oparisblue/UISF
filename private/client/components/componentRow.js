/**
* A row component ment for you in the grid component.
* @author Simon Watson
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