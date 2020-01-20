class Component {
	
	constructor(x, y) {
		this.constraints = [];
		this.animations = [];
		this.children = [];
		this.parent = null;
		
		this.hasChanged = new Set();
		
		this.outlets = {};
		this.eventListeners = {};
		
		this.fields  = {};
		this.events  = {};
		this.actions = {};
		
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
								${field.value.getIcon()} ${field.name}
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
							${field.value.getIcon()} ${field.name}
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
		this.constraints.push(constraint);
	}
	
	addWire(ev, type, otherCompId, otherCompInlet) {
		let obj = {
			to: otherCompId,
			do: otherCompInlet
		}
		if (this.eventListeners.hasOwnProperty(ev)) this[type][ev].push(obj);
		else this[type][ev] = [obj];
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
		// Tick element
		this.onTick();
		
		// Clear the changed elements
		this.hasChanged.clear();
		
		// Animations
		for (let i = this.animations.length - 1; i >= 0; i--) {
			this.animations[i].onTick(this);
			if (this.animations[i].isDone()) {
				this.animations.splice(i, 1);
			}
		}
		
		// Wires
		for (let outlet of Object.keys(this.outlets)) {
			for (let o of this.outlets[outlet]) {
				pageComponents[o.to].setField(o.do, this.fields[outlet].value.value);
			}
		}
		
		// Tick children
		for (let child of this.children) child.onUpdateTick();
		
	}
	
	fireEvent(ev, ...params) {
		if (!this.eventListeners.hasOwnProperty(ev)) return;
		for (let listener of this.eventListeners[ev]) {
			pageComponents[listener.do].getMethods()[listener.method](...params);
		}
	}
	
	setField(field, value) {
		this.fields[field].value.setValue(value);
		this.hasChanged.add(field);
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
				right.appendChild(data.value.getInspector(field, this));
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
	
	forceRefresh() {
		// Trigger changes on all of the fields to get their initial values
		for (let field of Object.keys(this.fields)) {
			this.hasChanged.add(field);
		}
	}
	
	startLayout() {
		// Create a list containing each type of constraint at most once.
		// The largest screen size breakpoint which is within the current screen size is used.
		
		let realisedConstraints = {};
		for (let constraint of this.constraints) {
			let type = constraint.getType();
			
			if (constraint.screenSize != -1 && window.innerWidth > constraint.screenSize) continue;		
			//console.log(constraint);	
			
			if (realisedConstraints.hasOwnProperty(type)) {
				let other = realisedConstraints[type].c;
				
				if (constraint.screenSize > other.screenSize) realisedConstraints[type].c = constraint;			
			}
			else {
				realisedConstraints[type] = {
					c:        constraint,
					resolved: false
				}
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