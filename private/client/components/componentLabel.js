/**
* Represents a component which displays text on the screen.<br>
* <strong>Parameters which are noticed:</strong>
* <table>
*	<tr><td style="padding:5px;"><code>title</code></td><td>Is the label a title (bold)?</td></tr>
*   <tr><td style="padding:5px;">"data"</td><td>Text / HTML to put into the label.</td></tr>
* </table>
* @author Orlando
*/
components["label"] = class ComponentLabel extends Component {
	
	constructor() {
		super(arguments);
		this.canHaveChildren = false;
		this.isTitle = this.hasArg("title", arguments);
		this.domNode = document.createElement("span");
		this.domNode.id = this.id;
		this.prevData = null;
	}
	
	/**
	* @Override
	*/
	onTick() {
		if (this.prevData != this.data) {
			this.domNode.innerHTML = this.data;
			this.prevData = this.data;
		}
		let css = this.isTitle ? `#${this.id}{font-weight:bold;}` : ``;
		return this.doDefaultRender(css);
	}
	
}