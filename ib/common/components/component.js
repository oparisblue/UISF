class Component {
	
	constructor(x, y) {
		
		// Describe the component
		this.fields  = {};
		this.events  = {};
		this.actions = {};
		
		// Propreties the component currently has		
		this.animations = [];
		this.children = [];
		this.parent = null;
		this.active = true; // Set to false to stop ticking this element
		
		// All of the environment variables for the component (fields, outlets, event listeners, constraints)
		this.evs = [];
		
		// Values derived from the environment variables
		this.constraints = {};
		this.eventListeners = [];
		this.outlets = [];
		this.tags = [];
		
		// Has something changed? Calls for rebuild of element DOM + this.outlets + this.eventListeners.
		this.hasChanged = true;
		
		// Build the dom node wrapper for the element
		
		this.domNode = document.createElement("div");
		this.domNode.classList.add("elementWrapper");
		
		if (IN_EDIT_MODE) {
			// Allow the user to select / drag the element
			this.domNode.addEventListener("mousedown", (event)=>{
				if (editorTool == Tools.SELECT) {
					event.preventDefault();
					event.stopPropagation();
					editSelectNode(this);
					startDragging(this, true, true, true);
				}
			});
			
			// If the user drops a wire onto this element
			this.domNode.addEventListener("mouseup", (event)=>{
				if (draggingWire != null) {
					event.preventDefault();
					event.stopPropagation();
					
					let actionHTML = ``;
					for (let k of Object.keys(this.actions)) {
						let ev = this.events[k];
						actionHTML += `
							<div class="inletRow" title="${ev.description}" onclick="editorWireTo(${this.id}, 'action', '${k}')">
								<i class="mdi mdi-arrow-right-bold"></i> ${ev.name}
							</div>
						`;
					}
					if (actionHTML == ``) actionHTML = `<div>No Actions!</div>`;
					
					let inletHTML = ``;
					for (let k of Object.keys(this.fields)) {
						let field = this.fields[k];
						inletHTML += `
							<div class="inletRow" title="${field.description}" onmouseup="editorWireTo(${this.id}, 'inlet', '${k}')">
								${field.getIcon()} ${field.name}
							</div>
						`;
					}
					if (inletHTML == ``) inletHTML = `<div>No Inlets!</div>`;
					
					let menu = $("#rightClickMenu");
					
					menu.innerHTML = `
						${draggingWire.type == "event"  ? `<strong>Actions:</strong><br>${actionHTML}` : `<strong>Inlets:</strong><br>${inletHTML}`}
					`;
					menu.style.left    = mouseX + "px";
					menu.style.top     = mouseY + "px";
					menu.style.display = "block";
					
					$("#overlay").style.display = "block";
					draggingWire.drawWire = false;
					$("#main").classList.remove("wireToElement");
				}
			});
			
			// Allow the user to right-click the element to wire it
			this.domNode.addEventListener("contextmenu", (event)=>{
				event.preventDefault();
				event.stopPropagation();
				dragging = null;
				
				let eventHTML = ``;
				for (let k of Object.keys(this.events)) {
					let ev = this.events[k];
					eventHTML += `
						<div title="${ev.description}">
							<i class="mdi mdi-arrow-right-bold"></i> ${ev.name}
							<div class="outletDragFrom" onmousedown="editorDragWire(this, ${this.id}, 'event', '${k}');"></div>
						</div>
					`;
				}
				if (eventHTML == ``) eventHTML = `<div>No Events!</div>`;
				
				let outletHTML = ``;
				for (let k of Object.keys(this.fields)) {
					let field = this.fields[k];
					outletHTML += `
						<div title="${field.description}">
							${field.getIcon()} ${field.name}
							<div class="outletDragFrom" onmousedown="editorDragWire(this, ${this.id}, 'outlet', '${k}');"></div>
						</div>
					`;
				}
				if (outletHTML == ``) outletHTML = `<div>No Outlets!</div>`;
				
				let menu = $("#rightClickMenu");
				
				menu.innerHTML = `
					<strong>Events:</strong><br>
					${eventHTML}<br>
					<strong>Outlets:</strong><br>
					${outletHTML}
				`;
				menu.style.left    = mouseX + "px";
				menu.style.top     = mouseY + "px";
				menu.style.display = "block";
				
				$("#overlay").style.display = "block";
			});
		}
		
		this.x = x;
		this.y = y;
		
		this.id = Component.nextId++;
	}
	
	
	// Abstract
	
	
	getEditorName()        { return ""; }
	getEditorDescription() { return ""; }
	getDefaultWidth()      { return 0;  }
	getDefaultHeight()     { return 0;  }
	onTick()               {            }
	
	
	// Concrete
	
	registerElement(ele) {
		if (IN_EDIT_MODE) ele.style.pointerEvents = "none";
		this.domNode.appendChild(ele);
	}
	
	addAnimation(animation) {
		this.animations.push(animation);
	}
	
	addConstraint(constraint) {
		this.setField(constraint.getType(), constraint, "constraint");
	}
	
	addWire(fromName, type, toId, toName) {
		let obj = {
			fromName:  fromName,
			type: type,
			toId: toId,
			toName: toName			
		}
		this.setField(fromName+toId+toName, obj, type.slice(0, -1));
	}
	
	addChild(child) {
		this.children.push(child);
		this.domNode.appendChild(child.domNode);
		child.parent = this;
	}
	
	removeChild(child) {
		this.children.splice(this.children.indexOf(child), 1);
		this.domNode.remove(child);
	}
	
	onUpdateTick() {
		// If there have been changes, reduce the environment variables into values
		if (this.hasChanged) {
			let lst = [];
			
			// Build the by applying each environment variable to it
			// They deal with fighting over properties, etc. We just get the array
			// at the end.
			for (let ev of this.evs) {
				ev.applyTo(lst);
			}
			
			// Clear / Reset all of these fields
			this.outlets = [];
			this.eventListeners = [];
			this.constraints = [];
			this.tags = [];
			for (let k of Object.keys(this.fields)) {
				this.fields[k].resetToDefault();
			}
			
			// Now, set these values using the flattened environment variable values
			for (let p of lst) {
				if (p.type == "field" || p.type == "constraint") this[p.type + "s"][p.name] = p.value;
				else                                             this[p.type + "s"].push(p.value);
			}
		}
		
		// Tick element
		this.onTick();
		
		// Clear the changed flag (do this after ticking the element first, so it can adjust the DOM, etc)
		this.hasChanged = false;
		
		// Animations
		for (let i = this.animations.length - 1; i >= 0; i--) {
			this.animations[i].onTick(this);
			if (this.animations[i].isDone()) {
				this.animations.splice(i, 1);
			}
		}
		
		// Wires
		for (let o of this.outlets) {
			if (o.type == "outlets") {
				pageComponents[o.toId].setField(o.toName, this.fields[o.fromName], "field", WIRE_TYPE);
			}
			else { // e.g. o.type = constraint
				pageComponents[o.toId].setField(o.toName, this.constraints[o.fromName], "constraint", WIRE_TYPE);
			}
		}
		
		// Tick children
		for (let child of this.children) child.onUpdateTick();
		
	}
	
	fireEvent(ev, ...params) {
		if (!this.eventListeners.hasOwnProperty(ev)) return;
		for (let listener of this.eventListeners) {
			if (listener.fromName == "ev") {
				pageComponents[listener.toId].methods[listener.toName](...params);
			}
		}
	}
	
	setField(field, value, type = "field", target = null) {
		// For setting a field FROM THE INSPECTOR
		// Sets the field using the environment variable for the current emulation state;
		// or make a new environment variable which matches it.
		
		let chosenEv = -1;
		if (target == null) target = evFromEmulation();
		
		for (let i = 0; i < this.evs.length; i++) {
			if (this.evs[i].equiv(target)) {
				if (
					this.evs[i].properties.hasOwnProperty(field) &&
					this.evs[i].properties[field].value == value
				) {
					return;
				}
				chosenEv = i;
				break;
			}
		}
		
		if (chosenEv == -1) {
			this.evs.push(target);
			chosenEv = this.evs.length - 1;
		}
		
		this.evs[chosenEv].properties[field] = {
			type: type,
			value: value
		}
		
		this.hasChanged = true;
	}
	
	getInspector() {
		let fields = Object.keys(this.fields);
		
		let elem = document.createElement("div");
		
		if (fields.length == 0) {
			
			elem.setAttribute("style", "position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);text-align:center;");
			elem.innerHTML = `<i class="mdi mdi-information-outline"></i><br>No Properties!`;
			
		}
		else {
			let title = document.createElement("div");
			title.classList.add("editorTitle");
			title.innerHTML = `<strong>${this.getEditorName()}</strong><br><small>${this.getEditorDescription()}</small>`;
			elem.appendChild(title);
			
			let table = document.createElement("table");
			let tbody = document.createElement("tbody");
			for (let field of fields) {
				let data = this.fields[field];
				let left = document.createElement("td");
				left.innerHTML = data.name + ":";
				left.title = data.description;
				let right = document.createElement("td");
				right.appendChild(data.getInspector(field, this));
				let row = document.createElement("tr");
				row.appendChild(left);
				row.appendChild(right);
				tbody.appendChild(row);
			}
			table.appendChild(tbody);
			elem.appendChild(table);
		}
		
		return elem;
		
	}
	
	/**
	* Call at the end of the constructor when making a new component.
	*/
	build() {		
		// Width + Height constants
		this.setField("width", new ConstraintWidth(this.getDefaultWidth()),  "constraint", new EVNormal());
		this.setField("width", new ConstraintWidth(this.getDefaultHeight()), "constraint", new EVNormal());
	}
	
	startLayout() {
		
		if (!this.active) return null;
		
		// Create a list containing each type of constraint at most once.
		// The largest screen size breakpoint which is within the current screen size is used.
		
		let realisedConstraints = {};
		for (let k of Object.keys(this.constraints)) {
			realisedConstraints[this.constraints[k].getType()] = {
				c:        this.constraints[k],
				resolved: false
			}
		}
		
		// Return a data object to represent this element when doing the layout.
		return {
			element:     this.domNode,
			id:          this.id,
			parent:      this.parrent,
			width:       this.getDefaultWidth(),
			height:      this.getDefaultHeight(),
			left:        NaN,
			top:         NaN,
			right:       NaN,
			bottom:      NaN,
			constraints: realisedConstraints
		};
	}
}

Component.nextId = 0;

let components = {};