class EquationParser {
	
	constructor(equation) {
		this.equation = equation;
		this.tokenList = [];
		this.rpn = [];
	}
	
	// String => List of Tokens
	makeTokenList() {
		let typeState = "";
		let funcCounter = 0;
		let tokens = ["+", "-", "*", "/", "%", "^", "(", ")"];
		let funcs = ["abs(", "sin(", "cos(", "tan(", "sqrt(", "ceil(", "floor(", "round("];
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
			if (!isNaN(char)) {
				// If the character is a continuation of a previous number, add it to it. Otherwise push to array
				if (typeState == "num") this.tokenList[this.tokenList.length] += char;
				else this.tokenList.push(char);
				typeState = "num";
			// If the character is a token, add it to the array
			} else if (tokens.includes(char)) {
				this.tokenList.push(char);
				typeState = "opp";
			// If the character is apart of a function, 
			} else if (funcs.filter((func) => func.indexOf(char) == 0).length > 0) {
				typeState = "func";
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
		return 0;
	}
	
	static parseEquation(equation) {
		return new EquationParser(equation).makeTokenList().toRPN().evaluateRPN();
	}
	
}

function testHelper() {
	let inst = new EquationParser("3 + 1 / sin(6 ^ 7)").makeTokenList();
	
	console.log(inst.tokenList);
	
}

testHelper();