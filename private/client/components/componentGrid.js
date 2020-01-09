/**
* An empty component, used purely as a container for other elements.
* @author Simon Watson
*/
components["grid"] = class ComponentGrid extends Component {
	
	constructor() {
		super(arguments);
		this.domNode = document.createElement("div");
		this.domNode.classList.add("grid");
		this.domNode.id = this.id;
		this.currentRow = new components["gridRow"]();
		this.rows = 0;
		this.cols = 0;
		this.cR = 0;
		this.cC = 0;
		
		console.log(this.args);
		
		let reg = /(\d+)[xX](\d+)/;
		for (let arg of this.args) {
			if (isString(arg) && reg.test(arg)) {
				let groups = reg.exec(arg).splice(1).map((x)=>parseInt(x));
				console.log(groups);
				this.rows = groups[0];
				this.cols = groups[1];
			}
		}
		
	}
	
	/**
	* @override
	*/
	addChild(child) {
		if (child == null) return;
		
		if (this.cR == this.rows) throw new Error("Maximum rows x columns reached!");
		
		let col = new components["gridCol"]();
		col.addChild(child);
		this.currentRow.addChild(col);
		
		this.cC++;
		if (this.cC == this.cols) {
			this.cC = 0;
			super.addChild(this.currentRow);
			this.cR++;
			this.currentRow = new components["gridRow"]();
		}
	}
	
	/**
	* @override
	*/
	onTick() {
		let css = `
			.grid {
				display: flex;
				flex-wrap: wrap;
			}
		`;
		return this.doDefaultRender(css);
	}
	
}