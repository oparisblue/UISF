class ConstraintInvisible extends Constraint {
	constructor(isInvisible) {
		super();
		this.isInvisible = isInvisible;
	}
	getType() { return "invisible"; }
}