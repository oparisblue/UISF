/**
* Represents a button which can be clicked by the user.
* @author Orlando
*/
components["button"] = class ComponentEmpty extends Component {
	
	constructor() {
		super(arguments);
		this.domNode = document.createElement("button");
		this.domNode.id = this.id;
		
		this.isDefault = this.hasArg("default");
		this.isDisabled = this.hasArg("disabled");
		this.name = this.data[0] == null ? "" : this.data[0];
		this.prevName = "";
		
		this.domNode.addEventListener("click", ()=>{
			fireEvent(this.func);
		});
	}
	
	/**
	* @override
	*/
	onTick() {
		
		if (this.prevName != this.name) {
			this.domNode.innerHTML = this.name;
			this.prevName = this.name;
		}
		
		let css = `
		
		`;
		
		return this.doDefaultRender("");
	}
	
}