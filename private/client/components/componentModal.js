/**
* An empty component, used purely as a container for other elements.
* @author Simon Watson
*/

function topModal() {
	return modals.length == 0 ? null : modals[modals.length - 1];
}

let modals = [];
components["modal"] = class ComponentModal extends Component {
	
	constructor() {
		super(arguments);
		this.domNode = document.createElement("div");
		this.domNode.id = this.id;
		this.domNode.classList.add("modalParent");
		
		let modalShade = document.createElement("div");
		modalShade.classList.add("modalShade");
		this.domNode.appendChild(modalShade);
		
		let modalContent = document.createElement("div");
		modalContent.classList.add("modalContent");
		this.domNode.appendChild(modalContent);
		
		modals.push(this);
	}
	
	/**
	* @override
	*/
	// addChild(child) {
	// 
	// }
	
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
			background-color: #0003;
			z-index: 0;
		}
		
		.modalContent {
			background-color: white;
			min-width: 400px;
			min-height: 300px;
			z-index: 1;
			box-shadow:0 20px 30px #0004;
		}
		`;
		return this.doDefaultRender(css);
	}
}