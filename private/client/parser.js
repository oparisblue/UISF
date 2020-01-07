function parseUIToComponent(ui, id) {
	// Ensure we always use *NIX line breaks, then break the string apart by lines
	let lines = ui.replace(/\r/g, `\n`).split(`\n`);
	// Parent all of the UI to an empty element
	let stack = [new components["empty"](id)];
	
	let prevComp = null;
	
	for (let line of lines) {
		
		// Check how indented the current line is
		let regex = /\t/g;
		let indents = 1;
		while ((result = regex.exec(line))) indents++;
		// If there are more indents than the current indent length, add the previous component as the parent
		if (indents > stack.length) stack.push(prevComp);
		// Otherwise if there are less indents, remove that many elements from the top of the stack
		else for (let i = stack.length; i > indents; i++) stack.pop();
		line = line.replace(/\t/g, "");
		
		// Parse the line to a set of parameters
		let params = [""];
		let escapeNext, inQuote = false;
		let index = 0;
		
		for (let char of line) {
			// If the character is an unescaped backslash, escape the next character.
			if (char == '\\' && !escapeNext)     { escapeNext = true; continue; }
			// If the character is an unescaped quote, toggle whether we are in a quote.
			// When this is the start of a quote, convert the parameter type to match.
			else if (char == '"' && !escapeNext) { if (inQuote = !inQuote) params[index] = new CompData(""); }
			// If this is a space not in a quote, begin a new parameter
			else if (char == ' ' && !inQuote)    { params[++index] = ""; }
			// If we are in a quote, add the character to the quote's data
			else if (inQuote)                    { params[index].data += char; }
			// Otherwise, add the character to the raw parameter string
			else                                 { params[index] += char; }
			escapeNext = false;
		}
		// Convert the set of parameters into a component object
		prevComp = new components[params.shift()](...params);
		stack[stack.length - 1].addChild(prevComp);
	}
	
	// The top element of the stack is the original empty element, with all of the parsed UI as its children.
	return stack[0];
}

function setScreen(ui) {
	$("#main").remove();
	activeComponents[0] = parseUIToComponent(ui, "#main");
	document.body.appendChild(activeComponents[0].getDOMNode());
	
}