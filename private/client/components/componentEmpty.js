/**
* An empty component, used purely as a container for other elements.
* @author Orlando
*/
components["empty"] = class ComponentEmpty extends Component {
	constructor() {
		super(arguments);
		this.domNode = document.createElement("div");
		this.domNode.id = this.id;
	}
}