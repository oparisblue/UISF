class ConstraintAlign extends Constraint {
	constructor(screenSize, direction, alignTo, constant) {
		super(screenSize)
		this.direction = direction;
		this.alignTo = alignTo;
		this.constant = constant;
	}
	getType() { return "align" + this.direction; }
}