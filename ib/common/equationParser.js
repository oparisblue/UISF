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
		return this;
	}
	
	// List of Tokens => RPN (shunting yard algorithm)
	makeRPN() {
		/**
1.  While there are tokens to be read:
2.        Read a token
3.        If it's a number add it to queue
4.        If it's an operator
5.               While there's an operator on the top of the stack with greater precedence:
6.                       Pop operators from the stack onto the output queue
7.               Push the current operator onto the stack
8.        If it's a left bracket push it onto the stack
9.        If it's a right bracket 
10.            While there's not a left bracket at the top of the stack:
11.                     Pop operators from the stack onto the output queue.
12.             Pop the left bracket from the stack and discard it
13. While there are operators on the stack, pop them to the queue
		*/
		return this;
	}
	
	// RPN => Result
	evaluateRPN() {
		let stack = [];
		for (let token of this.rpn) {
			// if token is an operator
			//     pop off n items from the stack (where n is the amount of args the operator takes)
			//     pass those values to the operator and push the operator's response onto the stack
			//     e.g.
			//
			//     let n = this.rpnOps[op].length;
			//	   stack.push(this.rpnOps[op](...stack.slice(-n)));
			//
			// otherwise
			//     just push the number onto the stack
			// doesn't account for variables / negative numbers idk
		}
		return stack.pop();
	}
	
	static parseEquation(equation) {
		return new EquationParser(equation).makeTokenList().toRPN().evaluateRPN();
	}
	
}