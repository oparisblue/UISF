function makeEqualityComp(id, name, desc, check, inputType) {
	components[id] = class extends ScriptingComponent {
		constructor(x, y) {
			super(x, y);
			
			this.check = check;
			
			this.fields = {
				INPUT_ONE: new inputType("p",   "The first input",  null,  SHOW_IN_INSPECTOR + SHOW_IN_INLETS),
				INPUT_TWO: new inputType("q",   "The second input", null,  SHOW_IN_INSPECTOR + SHOW_IN_INLETS),
				OUTPUT:    new DTBool("Output", `True if ${desc}`,  false, SHOW_IN_OUTLETS)
			};
			
			this.build();
		}
		
		onTick() {
			this.fields.OUTPUT.value = this.check(this.fields.INPUT_ONE.value, this.fields.INPUT_TWO.value);
		}
		
		static getEditorInfo() {
			return {
				name: name,
				description: `Checks if ${desc}`
			}
		}
	}
}

makeEqualityComp("eq",  "Equal",                    "p and q are equal",               (p, q)=>p == q, DTAny);
makeEqualityComp("neq", "Not Equal",                "p and q are not equal",           (p, q)=>p != q, DTAny);
makeEqualityComp("gt",  "Greater Than",             "p is greater than q",             (p, q)=>p >  q, DTNumber);
makeEqualityComp("gte", "Greater Than or Equal To", "p is greater than or equal to q", (p, q)=>p >= q, DTNumber);
makeEqualityComp("lt",  "Lesser Than",              "p is lesser than q",              (p, q)=>p <  q, DTNumber);
makeEqualityComp("lte", "Lesser Than or Equal To",  "p is lesser than or equal to q",  (p, q)=>p <= q, DTNumber);