/**
* Represents a button which can be clicked by the user.
* @author Orlando
*/
components["button"] = class ComponentButton extends Component {
	
	constructor() {
		super(arguments);
		this.domNode = document.createElement("button");
		this.domNode.id = this.id;
		
		this.isDefault = this.hasArg("default");
		this.isDisabled = this.hasArg("disabled");
		this.name = this.data[0] == null ? "" : this.data[0];
		this.prev = [null, null, null];
		
		this.domNode.addEventListener("click", ()=>{
			fireEvent(this.func);
		});
	}
	
	/**
	* @override
	*/
	onTick() {
		
		if (this.prev[0] != this.name || this.prev[1] != this.isDefault || this.prev[2] != this.isDisabled) {
			this.domNode.innerHTML = this.name;
			this.domNode.setAttribute("class", this.isDefault ? "buttonDefault" : "");
			this.domNode.disabled = this.isDisabled;
			this.prev = [this.name, this.isDefault, this.isDisabled];
		}
		
		return this.doDefaultRender("");
	}
	
}