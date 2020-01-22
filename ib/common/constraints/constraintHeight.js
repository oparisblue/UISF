class ConstraintHeight extends Constraint {
	constructor(height) {
		super();
		this.height = height;
	}
	getType() { return "height"; }
}