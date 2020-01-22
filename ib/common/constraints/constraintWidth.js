class ConstraintWidth extends Constraint {
	constructor(width) {
		super();
		this.width = width;
	}
	getType() { return "width"; }
}