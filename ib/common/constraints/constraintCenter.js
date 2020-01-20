class ConstraintCenter extends Constraint {
	constructor(screenSize, axis) {
		super(screenSize);
		this.axis = axis;
	}
	getType() { return "center" + this.axis; }
}