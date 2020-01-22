/**
* If an object has the given property, return its value, otherwise return false.
*/
function valOrFalse(obj, prop) {
	return obj != undefined && obj != null && obj.hasOwnProperty(prop) ? obj[prop] : false;
}

window.addEventListener("resize", ()=>{
	Environment.width = window.innerWidth;
	environmentHasChanged = true;
	redoLayout();
});

function redoLayout() {	
	
	// Get the layout objects for all of the components
	let comps = [];
	for (let k of Object.keys(pageComponents)) {
		// Get the layout object for this component
		let constraints = pageComponents[k].startLayout();
		// Reset the style for every element
		constraints.element.setAttribute("style", `display:none;`);
		// Push the component so that constraints get calculated for it, unless it's null (e.g. a scripting component)
		if (constraints != null) comps.push(constraints);
	}
	
	console.log("Rebuilding layout...");
	let timeNow = Date.now();
	let showWarnings = true; // Should warning messages be displayed for bad constraint sets? Disabled after the first loop.
	
	// Loop until either we resolve all constraints, or we can resolve no further
	while (true) {
		let hasChanged = false;
		let unresolved = "";
		
		// Loop through all of the components
		for (let i = comps.length - 1; i >= 0; i--) {
			// Record if we have all the right stuff, otherwise complain
			let hasWidth = false, hasHeight = false, hasCenterX = false, hasCenterY = false, alignX = 0, alignY = 0, invisible = false;
			
			let comp = comps[i];
			
			// Find the element's parent (if any)
			let parentX = translateX;
			let parentY = translateY;
			let parentWidth = translateX + window.innerWidth;
			let parentHeight = translateY + window.innerHeight;
			
			if (comp.parent != null) {
				for (let j = 0; j < comps.length; j++) {
					if (comps[j].id == comp.parent.id) {
						parentX, parentY = 0;
						parentWidth, parentHeight = null;
						if (valOrFalse(other.constraints.width, "resolved") ||
							(valOrFalse(other.constraints.alignLeft, "resolved") && valOrFalse(other.constraints.alignRight, "resolved"))) {
							parentWidth = comp[j].width;
						}
						if (valOrFalse(other.constraints.height, "resolved") ||
							(valOrFalse(other.constraints.alignTop, "resolved") && valOrFalse(other.constraints.alignBottom, "resolved"))) {
							parentHeight = comp[j].height;
						}
					}
				}
			}
			
			
			// Loop through all of its constraints
			for (let k of Object.keys(comp.constraints)) {
				let constraint = comp.constraints[k];
				
				// Skip constraints where there is nothing more to do
				if (constraint.resolved) continue;
				
				switch (k) {
					
					// Width and height are easy
					
					case "width" :
						comp.width = constraint.c.width;
						hasWidth = true;
						constraint.resolved = true;
						hasChanged = true;
						break;
					case "height" :
						comp.height = constraint.c.height;
						hasHeight = true;
						constraint.resolved = true;
						hasChanged = true;
						break;
						
					// If it's invisible, remove the element from those to be re-laid out.
					
					case "invisible" :
						if (constraint.c.isInvisible) {
							comps.splice(i, 1);
							invisible = true;
						}
						constraint.resolved = true;
						hasChanged = true;
						break;
						
					// Center requires the width/height not be 0
					
					case "centerX" :
						if (comp.width != 0 && parentWidth != null) {
							comp.left = (parentWidth - comp.width) / 2;
							constraint.resolved = true;
							hasChanged = true;
						}
						hasCenterX = true;
						break;
					case "centerY" :
						if (comp.height != 0 && parentHeight != null) {
							comp.top = (parentHeight - comp.height) / 2;
							constraint.resolved = true;
							hasChanged = true;
						}
						hasCenterY = true;
						break;
					
					// Align requires the other element be in position first
					
					case "alignLeft" :
					case "alignRight" :
					case "alignTop" :
					case "alignBottom" :
						// Get the direction to align: left, right, top or bottom
						let dir = k.slice(5).toLowerCase();
						
						// Keep track of it (for the error messages)
						if (dir == "left" || dir == "right") alignX++;
						else alignY++;

						// Easy case: align to that side of the screen
						if (constraint.c.alignTo == -1) {
							comp[dir] = constraint.c.constant + (comp.parent == null ? {
								"left":parentX, "right": parentX, "top": parentY, "bottom": parentY
							}[dir] : 0);
							constraint.resolved = true;
							hasChanged = true;
						}
						// Hard case: find other (resolved) element and base our position off of them
						else {
							// Find the other element
							let other = null;
							for (let otherComp of comps) {
								if (otherComp.id == constraint.c.alignTo) {
									other = otherComp;
									break;
								}
							}
							
							// If we found it
							if (other != null)  {
								
								// left:   alignLeft   + width  | alignRight
								// right:  alignRight  - width  | alignLeft
								// bottom: alignTop    + height | alignBottom
								// top:    alignBottom - height | alignTop
								
								if (dir == "left" &&
								((valOrFalse(other.constraints.alignLeft, "resolved") && valOrFalse(other.constraints.width, "resolved")) ||
								valOrFalse(other.constraints.alignRight, "resolved"))
								) {
									comp.left = ((other.left + other.width) || other.right) + constraint.c.constant;
									constraint.resolved = true;
									hasChanged = true;
								}
								else if (dir == "right" &&
								((valOrFalse(other.constraints.alignRight, "resolved") && valOrFalse(other.constraints.width, "resolved")) ||
								valOrFalse(other.constraints.alignLeft, "resolved"))
								) {
									comp.left = ((other.right - other.width) || other.left) - constraint.c.constant - comp.width;
									constraint.resolved = true;
									hasChanged = true;
								}
								else if (dir == "top" &&
								((valOrFalse(other.constraints.alignBottom, "resolved") && valOrFalse(other.constraints.height, "resolved")) ||
								valOrFalse(other.constraints.alignTop, "resolved"))
								) {
									comp.top = ((other.top + other.height) || other.bottom) + constraint.c.constant;
									constraint.resolved = true;
									hasChanged = true;
								}
								else if (dir == "bottom"  &&
								((valOrFalse(other.constraints.alignTop, "resolved") && valOrFalse(other.constraints.height, "resolved")) ||
								valOrFalse(other.constraints.alignBottom, "resolved"))
								) {
									comp.top = ((other.bottom - other.height) || other.top) - constraint.c.constant - comp.height;
									constraint.resolved = true;
									hasChanged = true;
								}
							}
						}

						// If we're done, can we also set the width / height? We'd need to have a resolved constraint on the other side, too...
						let otherSide = comp.constraints["align" + {"left":"Right", "right":"Left", "top":"Bottom", "bottom":"Top"}[dir]];
						if (constraint.resolved && otherSide != null && otherSide.resolved) {
							if (dir == "left" || dir == "right") {
								// Warning if they also have a width - it will be overriden!
								if (comp.constraints.hasOwnProperty("width"))
									console.warn(`WARN: Component ${comp.id}: constraint fighting between (alignLeft, alignRight) and width!`);
								
								comp.width = comp.right - comp.left;
							}
							else if (dir == "top" || dir == "bottom") {
								// Warning if they also have a height - it will be overriden!
								if (comp.constraints.hasOwnProperty("width"))
									console.warn(`WARN: Component ${comp.id}: constraint fighting between (alignTop, alignBottom) and height!`);
									
								comp.height = comp.bottom - comp.top;
							}
						}
					
						break;
					
				}
				if (invisible) break;
				if (!constraint.resolved) unresolved += `${unresolved.length > 0 ? ", " : ""}${comp.id}.${k}`;
			}
			
			if (showWarnings && !invisible) {
				if (!hasWidth  && alignX < 2) console.warn(`WARN: Component ${comp.id}: can't determine width!`);
				if (!hasHeight && alignY < 2) console.warn(`WARN: Component ${comp.id}: can't determine height!`);
				if (alignX == 0)              console.warn(`WARN: Component ${comp.id}: can't determine X position!`);
				if (alignY == 0)              console.warn(`WARN: Component ${comp.id}: can't determine Y position!`);
				if (alignX > 0 && hasCenterX
				||  alignY > 0 && hasCenterY) console.warn(`WARN: Component ${comp.id}: constraint fighting between align and center!!`);
			}
			
		}
		
		if (!hasChanged) { // Nothing has changed = exit the loop
			if (unresolved.length > 0) console.warn(`WARN: Unresolvable constraints: ${unresolved}!`);
			break;
		}
		showWarnings = false; // Only show warnings on the first loop
	}	
	
	// Actually style the elements based off of their constraints
	for (let comp of comps) {
		comp.element.style.display  = "block";
		comp.element.style.position = "absolute";
		comp.element.style.overflow = "hidden";
		
		comp.element.style.width  = comp.width + "px";
		comp.element.style.height = comp.height + "px";
		
		let actualComp = pageComponents[comp.id];
		let isDragged = dragging != null && dragging.element.id == comp.id;
		
		comp.element.style.left  = (isDragged || isNaN(comp.left) ? (actualComp.x || 0) + translateX : comp.left) + "px";
		comp.element.style.top   = (isDragged || isNaN(comp.top)  ? (actualComp.y || 0) + translateY : comp.top)  + "px";
		if (!isNaN(comp.right))  comp.element.style.right  = comp.right  + "px";
		if (!isNaN(comp.bottom)) comp.element.style.bottom = comp.bottom + "px";
	}
	console.log(`...done (${Date.now() - timeNow}ms)`);
}