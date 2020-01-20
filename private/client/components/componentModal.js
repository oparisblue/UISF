/**
* Implements Modal windows.
* @author Simon Watson
* @author Orlando
*/

let modals = [];

components["modal"] = class ComponentModal extends Component {
	
	constructor() {
		super(arguments);
		this.domNode = document.createElement("div");
		this.domNode.id = this.id;
		this.domNode.classList.add("modalParent");
		
		this.modalShade = new components["empty"]();
		this.modalShade.domNode.classList.add("modalShade");
		this.domNode.appendChild(this.modalShade.domNode);
		
		this.modalContent = new components["empty"]();
		this.modalContent.domNode.classList.add("modalContent");
		this.domNode.appendChild(this.modalContent.domNode);
		
		this.children.push(this.modalContent);
		this.children.push(this.modalShade);
		
		this.finisher = this.func;
		
		modals.push(this);
	}
	
	complete(state) {
		modals.pop();
		
		let animation = new BasicAnimation({animation: "pop", timingFunc: Easing.easeIn, duration: 100, from: 0.5, to: 1, reverse: true});
		animation.onDone = ()=>{
			this.remove();
		}
		this.modalContent.addAnimation(animation);
		this.modalShade.addAnimation(new BasicAnimation({animation: "fade", duration: 100, timingFunc: Easing.easeOut, reverse: true}));
		
		//this.remove();
		fireEvent("modalClosed" + this.id, state);
	}
	
	/**
	* @override
	*/
	addChild(child) {
		this.modalContent.addChild(child);
	}
	/**
	* @override
	*/
	onTick() {
		let css = `
		.modalParent {
			position: absolute;
			z-index: ${10000 + modals.length};
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		.modalShade {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: #000a;
			z-index: 0;
		}
		
		.modalContent {
			background-color: ${getColour(1)};
			min-width: 400px;
			z-index: 1;
			box-shadow:0 20px 30px #0004;
			box-sizing:border-box;
			padding:10px;
			border-radius:${Constants.BORDER_RADIUS};
			border-top:solid 1px ${getColour(4)};
			border-bottom:solid 1px ${getColour(0)};
		}
		`;
		return this.doDefaultRender(css);
	}
}

/**
* Get the currently open top modal window.
*/
function topModal() {
	return modals.length == 0 ? null : modals[modals.length - 1];
}

/**
* Creates a new modal window, containing the given UI view.
* Returns a promise which is resolved when the modal is closed.
*/
function modal(ui) {
	return new Promise((resolve, _)=>{
		// Create the modal
		let modal = new components["modal"]("->modalClosed");
		// Parse the ui screen and add it to the modal
		modal.addChild(parseUIToComponent(ui, "modalContent" + Component.nextID++));
		// Animate the modal
		modal.modalContent.addAnimation(new BasicAnimation({animation: "pop", timingFunc: Easing.bounceIn, duration: 500, from: 0.5, to: 1}));
		modal.modalShade.addAnimation(new BasicAnimation({animation: "fade", duration: 100, timingFunc: Easing.easeOut}));
		// Put the modal on the page
		activeComponents[2].addChild(modal);
		// Resolve the promise when closed
		subscribeEvent("modalClosed" + modal.id, (state)=>{
			resolve(state);
		});
	});
}

/**
* Buttons which are displayed at the bottom of a modal.
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

/**
* Creates a new title component which is displayed at the top of the modal.
*/
components["modalTitle"] = class ComponentModalTitle extends components["label"] {
	constructor() {
		super(...arguments);
		this.domNode.classList.add("modalTitle");
	}
	
	/**
	* @override
	*/
	onTick() {
		this.isTitle = false;
		return super.onTick() + `.modalTitle {
			width:calc(100% + 20px);
			display:block;
			position:relative;
			left:-10px;
			top:-10px;
			padding:5px;
			border-radius:${Constants.BORDER_RADIUS} ${Constants.BORDER_RADIUS} 0 0;
			background-color:${getColour(3)};
			border-bottom:${getColour(1)};
			text-align:center;
			box-sizing:border-box;
			height:29px;
		}
		`;
	}
	
}