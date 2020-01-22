class ConstraintAlign extends Constraint {
	constructor(direction, alignTo, constant) {
		super();
		this.direction = direction;
		this.alignTo = alignTo;
		this.constant = constant;
	}
	getType() { return "align" + this.direction; }
}