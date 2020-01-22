class ComponentButton extends Component {
	
	constructor(x, y) {
		super(x, y);
		
		this.button = document.createElement("button");
		this.domNode.addEventListener("click", ()=>{
			this.fireEvent("pressed");
		});
		this.registerElement(this.button);
		
		this.fields = {
			label:    new DTString("Label", "The label displayed on the button.", ""),
			default:  new DTBool("Default", "If the button is default, it is highlighted, and when the user presses enter it is clicked.", false),
			disabled: new DTBool("Disabled", "Is the user prevented from interacting with the button?", false),
		};
		
		this.events = {
			"pressed": {"name": "Pressed", "description": "Called when the button is pressed."}
		};
		
		this.build();
		
	}
	
	getDefaultWidth()      { return 100; }
	getDefaultHeight()     { return 20;  }
	
	onTick() {
		if (this.hasChanged) {
			this.button.innerHTML = this.fields.label.getValue();
			toggleClass(this.button, "buttonDefault", this.fields.default.getValue());
			this.button.disabled = this.fields.disabled.getValue();
		}
	}
	
	static getEditorInfo() {
		return {
			name: "Button",
			description: "A button which can be clicked by the user."
		}
	}
	
}
components.button = ComponentButton;