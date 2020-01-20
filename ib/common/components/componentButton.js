class ComponentButton extends Component {
	
	constructor(x, y) {
		super(x, y);
		
		this.button = document.createElement("button");
		this.domNode.addEventListener("click", ()=>{
			this.fireEvent("pressed");
		});
		this.registerElement(this.button);
		
		this.fields = {
			"label": {"name": "Label", "description": "The label displayed on the button.", "value": new DTString("")},
			"default": {"name": "Default", "description": "If the button is default, it is highlighted, and when the user presses enter it is clicked.", "value": new DTBool(false)},
			"disabled": {"name": "Disabled", "description": "Is the user prevented from interacting with the button?", "value": new DTBool(false)}
		};
		
		this.events = {
			"pressed": {"name": "Pressed", "description": "Called when the button is pressed."}
		};
		
		this.forceRefresh();
		
	}
	
	getEditorName() { return "Button"; }
	getEditorDescription() { return "A button which can be clicked by the user."; }
	getDefaultWidth()      { return 100; }
	getDefaultHeight()     { return 20;  }
	
	onTick() {
		for (let change of this.hasChanged) {
			switch (change) {
				case "label": this.button.innerHTML = this.fields.label.value.value; break;
				case "default": toggleClass(this.button, "buttonDefault", this.fields.default.value.value); break;
				case "disabled": this.button.disabled = this.fields.disabled.value.value; break;
			}
		}
	}
	
}
components.button = ComponentButton;