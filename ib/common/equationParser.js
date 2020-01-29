class EquationParser {
	
	constructor(equation) {
		this.equation = equation;
		this.tokenList = [];
		this.rpn = [];
		
		this.rpnOps = {
			"+":      (p, q) => p + q,
			"-":      (p, q) => p - q,
			"*":      (p, q) => p * q,
			"/":      (p, q) => p / q,
			"^":      (p, q) => Math.pow(p, q),
			"%":      (p, q) => p % q,
			"#":      (p)    => -p,
			"fact(":  (p)    => [...Array(p + 1).keys()].slice(1).reduce((acc, val)=>acc * val, 1),
			"sin(":   (p)    => Math.sin(p),
			"cos(":   (p)    => Math.cos(p),
			"tan(":   (p)    => Math.tan(p),
			"deg(":   (p)    => (p * 180) / Math.PI,
			"rad(":   (p)    => (p * Math.PI) * 180,
			"ceil(":  (p)    => Math.ceil(p),
			"floor(": (p)    => Math.floor(p),
			"round(": (p)    => Math.round(p),
			"abs(":   (p)    => Math.abs(p),
			"sqrt(":  (p)    => Math.sqrt(p),
		};
		
	}
	
	// String => List of Tokens
	makeTokenList() {
		let typeState = "";
		let funcCounter = 0;
		let tokens = ["+", "-", "*", "/", "%", "^", "(", ")"];
		let funcs = ["abs(", "sin(", "cos(", "tan(", "sqrt(", "ceil(", "floor(", "round(", "fact("];
		let isNegate = true;
		// Loop through the equation string
		for (let i = 0; i < this.equation.length; i++) {
			let char = this.equation[i];
			// if the character is empty space, continue
			if (char == " ") continue;
			// If the current character is a continuation of a function name, add the prevoius characters to
			// the current letter in reverce order
			if (typeState == "func" && funcCounter != 0) {
				char = "";
				for (let j = i - funcCounter; j <= i; j++) char += this.equation[j];
			}
			// If the character is a number,
			if (!isNaN(char) || char == '.') {
				// If the character is a continuation of a previous number, add it to it. Otherwise push to array
				if (typeState == "num") this.tokenList[this.tokenList.length - 1] += char;
				else this.tokenList.push(char);
				typeState = "num";
				isNegate = false;
			// If the character is a token, add it to the array
			} else if (tokens.includes(char)) {
				console.log(isNegate);
				this.tokenList.push(char == '-' && isNegate ? "#" : char);
				typeState = "opp";
				isNegate = char != ")";
			// If the character is apart of a function, 
			} else if (funcs.filter((func) => func.indexOf(char) == 0).length > 0) {
				typeState = "func";
				isNegate = true;
				let finalFunc = false;
				// Check if it is exactly the same as any of the function names
				for (let j = 0; j < funcs.length; j++) if (funcs[j] == char) finalFunc = true;
				// if it is, add the whole thing to the list
				if (finalFunc) {
					this.tokenList.push(char);
					funcCounter = 0;
				} else funcCounter++;
			}
		}
		return this;
	}
	
	// List of Tokens => RPN (shunting yard algorithm)
	toRPN() {
		let operatorsStack = [];
		let operatorsValues = [];
		let operators = {
			"abs(":   6,
			"sin(":   6,
			"cos(":   6,
			"tan(":   6,
			"sqrt(":  6,
			"ceil(":  6,
			"floor(": 6,
			"round(": 6,
			"fact(":  6,
			"+":      4,
			"-":      4,
			"*":      3,
			"/":      3,
			"^":      2,
			"%":      2,
			"#":      1,
		}
		
		// 1. While there are tokens to be read:
		// 2. Read a token
		for (let value of this.tokenList) {
			// 3. If it's a number add it to queue
			if (!isNaN(value)) this.rpn.push(value);
			// 4. If it's an operator
			else if (operators.hasOwnProperty(value)) {
				// 5. While there's an operator on the top of the stack with greater or equal precedence:
				while (operatorsValues[operatorsValues.length - 1] <= operators[value] && operators[value] != 6) {
					// 6. Pop operators from the stack onto the output queue
					this.rpn.push(operatorsStack.pop());
					operatorsValues.pop();
				}
				// 7. Push the current operator onto the stack
				operatorsStack.push(value);
				operatorsValues.push(operators[value]);
			}
			// 8. If it's a left bracket push it onto the stack
			else if (value == "(") {
				operatorsStack.push(value);
				operatorsValues.push(5);
			}
			// 9. If it's a right bracket 
			else if (value == ")") {
				let level;
				// 10. While there's not a left bracket at the top of the stack:
				while (operatorsValues.length > 0) {
					level = operatorsValues[operatorsValues.length - 1];
					if (level == 5) break;
					
					// 11. Pop operators from the stack onto the output queue.
					this.rpn.push(operatorsStack.pop());
					operatorsValues.pop();
					
					if (level == 6) break;
				}
				// 12. Pop the left bracket from the stack and discard it
				if (level == 5) {
					operatorsStack.pop();
					operatorsValues.pop();
				}
			}
		}
		// 13. While there are operators on the stack, pop them to the queue
		for (let i = operatorsStack.length - 1; i >=0; i--) this.rpn.push(operatorsStack[i]);
		
		return this;
	}
	
	// RPN => Result
	evaluateRPN() {
		let stack = [];
		for (let token of this.rpn) {
			// if token is an operator
			if (this.rpnOps.hasOwnProperty(token)) {
				// pop off n items from the stack (where n is the amount of args the operator takes)
				// pass those values to the operator
				let n = this.rpnOps[token].length;
				let args = stack.slice(-n);
				stack = stack.slice(0, -n);
				// and push the operator's response onto the stack
				stack.push(this.rpnOps[token](...args));
			}
			// otherwise ust push the number onto the stack
			else stack.push(parseFloat(token));

			// doesn't account for variables / negative numbers idk
		}
		return stack.pop();
	}
	
	static parseEquation(equation) {
		return new EquationParser(equation).makeTokenList().toRPN().evaluateRPN();
	}
	
}

function testHelper() {
	let inst = new EquationParser("5+-10").makeTokenList();
	
	console.log("Step 1:", inst.tokenList);
	
	inst.toRPN();
	
	console.log("Step 2:", inst.rpn);
	
	console.log("Step 3:", inst.evaluateRPN());
	
	
}

testHelper();