class ConstraintInvisible extends Constraint {
	constructor(screenSize, isInvisible) {
		super(screenSize);
		this.isInvisible = isInvisible;
	}
	getType() { return "invisible"; }
}