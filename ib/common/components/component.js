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
	
	// Functions for tags
	/**
	* Adds the tagId to the components tags array.
	* @param {any}id The id of the tag
	*/
	addTag(id) {
		if (!this.tags.includes(id)) this.tags.push(id);
	}
	
	/**
	* Removes the tagId from the components tags array.
	* @param {any}id The id of the tag
	*/
	removeTag(id) {
		if (this.tags.includes(id)) this.tags.splice(this.tags.indexOf(id), 1);
	}
	
	
	// Abstract
	
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
	
	toggleConstraint(constraintId) {
		let amountOn = 0;
		if (constraintId == 5) {
			for (let i = 0; i < 4; i++) if ($(`#constraint${i + 1}Icon`).style.fill == "red") amountOn++;
			for (let i = 0; i < 5; i++) $(`#constraint${i + 1}Icon`).style.fill = amountOn == 4 ? "" : "red";
		} else {
			$(`#constraint${constraintId}Icon`).style.fill = $(`#constraint${constraintId}Icon`).style.fill ? "" : "red";
			for (let i = 0; i < 4; i++) if ($(`#constraint${i + 1}Icon`).style.fill == "red") amountOn++;
			if (amountOn == 4) $("#constraint5Icon").style.fill = "red";
			else $("#constraint5Icon").style.fill = "";
		} 
	}
	
	getInspector() {
		let fields = Object.keys(this.fields);
		
		let elem = document.createElement("div");
		
		let title = document.createElement("div");
		title.classList.add("editorTitle");
		let elementInfo = this.constructor.getEditorInfo();
		title.innerHTML = `<strong>${elementInfo.name}</strong><br><small>${elementInfo.description}</small>`;
		elem.appendChild(title);
		
		// Size position
		let constraintsContainer = document.createElement("div");
		constraintsContainer.classList.add("editorSection");
		constraintsContainer.insertAdjacentHTML("beforeend", "<strong>Size & Constraints</strong>");
		
		let constraintsBox = document.createElement("div");
		constraintsBox.classList.add("constraintsBox");
		
		let topConstraintRow = document.createElement("div");
		topConstraintRow.classList.add("constraintRow");
		
		let topConstraintInput = document.createElement("input");
		topConstraintInput.setAttribute("type", "number");
		topConstraintInput.style.width = "50px";
		let topConstraintSelect = document.createElement("select");
		topConstraintRow.appendChild(topConstraintInput);
		topConstraintRow.appendChild(topConstraintSelect);
		
		let middleConstraintRow = document.createElement("div");
		middleConstraintRow.classList.add("constraintRow");
		
		let leftConstraintInput = document.createElement("input");
		leftConstraintInput.setAttribute("type", "number");
		leftConstraintInput.style.width = "50px";
		let leftConstraintSelect = document.createElement("select");
		middleConstraintRow.appendChild(leftConstraintInput);
		middleConstraintRow.appendChild(leftConstraintSelect);
	
		middleConstraintRow.insertAdjacentHTML("beforeend", `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84">
				<defs>
					<style>
						.cls-1 {
							opacity: 0;
							cursor: pointer;
						}
						.cls-2 {
							fill: #fff;
						}
					</style>
				</defs>
				<title>constraints</title>
				<g>
					<polygon id="constraint1Icon" class="cls-2" points="33 0 51 0 51 2 43 2 43 25 51 25 51 27 33 27 33 25 41 25 41 2 33 2 33 0" />
					<polygon id="constraint2Icon" class="cls-2" points="84 33 84 51 82 51 82 43 59 43 59 51 57 51 57 33 59 33 59 41 82 41 82 33 84 33" />
					<polygon id="constraint3Icon" class="cls-2" points="33 57 51 57 51 59 43 59 43 82 51 82 51 84 33 84 33 82 41 82 41 59 33 59 33 57" />
					<polygon id="constraint4Icon" class="cls-2" points="27 33 27 51 25 51 25 43 2 43 2 51 0 51 0 33 2 33 2 41 25 41 25 33 27 33" />
					<path id="constraint5Icon" class="cls-2" d="M42,34.5A7.5,7.5,0,1,0,49.5,42,7.5,7.5,0,0,0,42,34.5ZM42,47a5,5,0,1,1,5-5A5,5,0,0,1,42,47Z" />
					<rect onclick="selectedElement.toggleConstraint(1)" class="cls-1" x="33" width="18" height="27" />
					<rect onclick="selectedElement.toggleConstraint(2)" class="cls-1" x="57" y="33" width="27" height="18" />
					<rect onclick="selectedElement.toggleConstraint(3)" class="cls-1" x="33" y="57" width="18" height="27" />
					<rect onclick="selectedElement.toggleConstraint(4)" class="cls-1" y="33" width="27" height="18" />
					<rect onclick="selectedElement.toggleConstraint(5)" class="cls-1" x="34.5" y="34.5" width="15" height="15" />
				</g>
			</svg>
		`);
		
		let rightConstraintInput = document.createElement("input");
		rightConstraintInput.setAttribute("type", "number");
		rightConstraintInput.style.width = "50px";
		let rightConstraintSelect = document.createElement("select");
		middleConstraintRow.appendChild(rightConstraintInput);
		middleConstraintRow.appendChild(rightConstraintSelect);
		
		let bottomConstraintRow = document.createElement("div");
		bottomConstraintRow.classList.add("constraintRow");
		
		let bottomConstraintInput = document.createElement("input");
		bottomConstraintInput.setAttribute("type", "number");
		bottomConstraintInput.style.width = "50px";
		let bottomConstraintSelect = document.createElement("select");
		bottomConstraintRow.appendChild(bottomConstraintInput);
		bottomConstraintRow.appendChild(bottomConstraintSelect);
		
		constraintsBox.appendChild(topConstraintRow);
		constraintsBox.appendChild(middleConstraintRow);
		constraintsBox.appendChild(bottomConstraintRow);
		
		constraintsContainer.appendChild(constraintsBox);
		
		elem.appendChild(constraintsContainer);
		
		// Tags
		let tagsContainer = document.createElement("div");
		tagsContainer.classList.add("editorSection");
		tagsContainer.insertAdjacentHTML("beforeend", "<strong>Tags</strong>");
		
		let tagsSection = document.createElement("div");
		tagsSection.classList.add("tagsSection");
		
		for (let i = 0; i < this.tags.length; i++) {
			let tag = document.createElement("div");
			tag.classList.add("tag", `tag${this.tags[i]}`);
			tag.innerText = Tag.tags[this.tags[i]].name;
			tag.style.backgroundColor = Tag.tags[this.tags[i]].getColour();
			
			let tagClose = document.createElement("i");
			tagClose.classList.add("mdi", "mdi-close-circle");
			tagClose.addEventListener("click", ()=> {
				this.removeTag(this.tags[i]);
				rebuildInspector();
			});
			tag.appendChild(tagClose);
			
			tagsSection.appendChild(tag);
		}
		
		let addTagButton = document.createElement("button");
		addTagButton.classList.add("addTagButton");
		addTagButton.innerText = "+";
		addTagButton.addEventListener("click", ()=> {			
			let popUp = openPopUp(addTagButton, 200, 240, true);
			
			popUp.insertAdjacentHTML("beforeend", "<strong>Add an existing tag</strong><br>");
			
			let tagsList = document.createElement("datalist");
			tagsList.id = "tagOptions";
			
			let tasgListInput = document.createElement("input");
			tasgListInput.setAttribute("list", "tagOptions");
			tasgListInput.setAttribute("type", "text");
			tasgListInput.style.marginTop = "5px";
			for (let k of Object.keys(Tag.tags)) {
				if (!this.tags.includes(k)) {
					let option = document.createElement("option");
					option.value = Tag.tags[k].name;
					option.setAttribute("data-id", Tag.tags[k].id);
					tagsList.appendChild(option);
				}
			}			
			
			let newTagName = document.createElement("input");
			newTagName.setAttribute("type", "text");
			newTagName.style.marginTop = "5px";
			
			let newTagType = document.createElement("select");
			for (let k of Object.keys(Tag.tagTypes)) {
				let option = document.createElement("option");
				option.setAttribute("value", k);
				option.innerText = Tag.tagTypes[k].getName();
				newTagType.appendChild(option);
			}
			
			let goButton = document.createElement("button");
			goButton.innerText = "Add";
			goButton.classList.add("buttonDefault");
			goButton.style.width = "70%";
			goButton.style.margin = "10px auto 0";
			
			goButton.addEventListener("click", ()=> {
				if (tasgListInput.value != "") {
					let list = $("#tagOptions");
					let tagDataId = null;
					for (let child of list.children) {
						if (child.value == tasgListInput.value) {
							tagDataId = child.dataset.id;
							break;
						}
					}
					if (tagDataId) {
						// Check if we are over the maximum amount of tags for this type
						let maxAmt = Tag.tags[tagDataId].constructor.getMaxPerElement();
						if (maxAmt > -1) {
							let typeToCheck = Tag.tags[tagDataId].constructor;
							let found = 0;
							for (let tag of this.tags) {
								if (Tag.tags[tag].constructor == typeToCheck && ++found >= maxAmt) {
									console.log("Max amount of tag type reaches");
									return;
								}
							}
						}
						
						this.tags.push(tagDataId);
						rebuildInspector();
						closeOverlay();
					} else console.log("Tag doesnt exist");
				} else {
					if (newTagName.value != "") {
						for (let k of Object.keys(Tag.tags)) {
							if (Tag.tags[k].name == newTagName.value) {
								console.log("No duplicate named tags");
								return;
							}
						}
						
						let maxAmt = Tag.tagTypes[newTagType.value].getMaxPerElement();
						if (maxAmt > -1) {
							let typeToCheck = Tag.tagTypes[newTagType.value].constructor;
							let found = 0;
							for (let tag of this.tags) {
								if (Tag.tagTypes[newTagType.value].constructor == typeToCheck && ++found >= maxAmt) {
									console.log("Max amount of tag type reaches");
									return;
								}
							}
						}
						
						this.tags.push(new Tag.tagTypes[newTagType.value](newTagName.value).id + "");
						rebuildInspector();
						closeOverlay();
					} else console.log("The new tag needs a name");
				}
			});
			
			popUp.appendChild(tasgListInput);
			popUp.appendChild(tagsList);
			popUp.insertAdjacentHTML("beforeend", "<br><br><strong>Or add a new one</strong><br><label>Tag name<label><br>");
			popUp.appendChild(newTagName);
			popUp.insertAdjacentHTML("beforeend", "<br><br><label>Tag type</label><br>");
			popUp.appendChild(newTagType);
			popUp.appendChild(goButton);
		});
		
		tagsSection.appendChild(addTagButton);
		tagsContainer.appendChild(tagsSection);
		
		elem.appendChild(tagsContainer);
		
		// Fields
		let fieldsContainer = document.createElement("div");
		fieldsContainer.classList.add("editorSection");
		fieldsContainer.insertAdjacentHTML("beforeend", "<strong>Fields</strong>");
		
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
		fieldsContainer.appendChild(table);
		elem.appendChild(fieldsContainer);
		
		return elem;
	}
	
	/**
	* Call at the end of the constructor when making a new component.
	*/
	build() {		
		// Width + Height constants
		this.setField("width", new ConstraintWidth(this.getDefaultWidth()),  "constraint", new EVNormal());
		this.setField("height", new ConstraintHeight(this.getDefaultHeight()), "constraint", new EVNormal());
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