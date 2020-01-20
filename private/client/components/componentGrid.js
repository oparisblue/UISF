/**
* A grid component with custom rows and columns
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
		
		let regGrid = /(\d+)[xX](\d+)/;
		for (let arg of this.args) {
			if (isString(arg) && regGrid.test(arg)) {
				let groups = regGrid.exec(arg).splice(1).map((x)=>parseInt(x));
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
		
		let regGutter = /gutter(\d+)/;
		let col = new components["gridCol"]();
		
		for (let arg of this.args) {
			if (isString(arg) && regGutter.test(arg)) {
				let gutterValue = regGutter.exec(arg)[1];
				col.domNode.style.margin = `0 ${gutterValue}px 0 ${gutterValue}px`;
			}
		}
		
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