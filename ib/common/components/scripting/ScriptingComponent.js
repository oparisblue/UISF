class ScriptingComponent extends Component {
	
	constructor(x, y) {
		super(x, y);
		
		this.component = document.createElement("button");
		this.registerElement(this.component);
	}
	
	getDefaultWidth()  { return 100; }
	getDefaultHeight() { return 100; }
	
	getInspector() { return [inspectorTitle, inspectorFields]; }
	
}