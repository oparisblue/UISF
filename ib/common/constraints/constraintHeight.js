class ConstraintHeight extends Constraint {
	constructor(screenSize, height) {
		super(screenSize);
		this.height = height;
	}
	getType() { return "height"; }
}