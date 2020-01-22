class ConstraintCenter extends Constraint {
	constructor(axis) {
		super();
		this.axis = axis;
	}
	getType() { return "center" + this.axis; }
}