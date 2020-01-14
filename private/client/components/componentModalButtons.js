/**
* Buttons which are displayed at the bottom of a modal.
* @author Orlando
*/
components["modalButtons"] = class ComponentModalButtons extends Component {
	constructor() {
		super(arguments);
		this.domNode = document.createElement("div");
		this.domNode.id = this.id;
		this.domNode.style.textAlign = "right";
		
		let hasAssignedDefault = false;
		let isNextDefault = false;
		
		for (let i = 0; i < this.args.length; i++) {
			let arg = this.args[i];
			if (arg.constructor == CompData) {
				let button = new components["button"](arg, "->modalButtonClicked");
				button.isDefault = isNextDefault || (i == this.args.length - 1 && !hasAssignedDefault);
				button.order = i;
				this.addChild(button);
				isNextDefault = false;
			}
			else if (arg.toLowerCase() == "default") {
				isNextDefault = true;
				hasAssignedDefault = true;
			}
		}
	}
}
/*
*/