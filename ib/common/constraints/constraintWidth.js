class ConstraintWidth extends Constraint {
	constructor(screenSize, width) {
		super(screenSize);
		this.width = width;
	}
	getType() { return "width"; }
}