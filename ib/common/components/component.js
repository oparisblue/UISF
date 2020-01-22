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
		this.tags = [];
		
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
		
		let title = document.createElement("div");
		title.classList.add("editorTitle");
		title.innerHTML = `<strong>${this.getEditorName()}</strong><br><small>${this.getEditorDescription()}</small>`;
		elem.appendChild(title);
		
		// Size position
		let constraintsContainer = document.createElement("div");
		constraintsContainer.classList.add("editorSection");
		constraintsContainer.insertAdjacentHTML("beforeend", "<strong>Constraints</strong>");
		
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
			$("#overlay").style.display = "block";
			let popUpWidth = 200;
			let popUpHeight = 100;
			let rect = addTagButton.getBoundingClientRect();
			let popUp = document.getElementById("popUp");
			
			popUp.style.left = `${rect.left + ((rect.width - popUpWidth) / 2)}px`;
			popUp.style.top = `${rect.top + rect.height + 20}px`;
			popUp.style.display = "block";
			popUp.style.minWidth = `${popUpWidth}px`;
			popUp.style.minHeight = `${popUpHeight}px`;
			
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
					} else console.log('Tag doesnt exist');
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
			right.appendChild(data.value.getInspector(field, this));
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