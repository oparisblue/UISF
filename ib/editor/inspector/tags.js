function inspectorTags(elem, comp) {
	let tagsContainer = document.createElement("div");
	tagsContainer.classList.add("editorSection");
	tagsContainer.insertAdjacentHTML("beforeend", "<strong>Tags</strong>");
	
	let tagsSection = document.createElement("div");
	tagsSection.classList.add("tagsSection");
	
	// List all existing tags in the inspector
	
	for (let tag of comp.tags) {
		let tagEle = document.createElement("div");
		tagEle.classList.add("tag");
		tagEle.innerHTML = Tag.tags[tag].name;
		tagEle.style.backgroundColor = Tag.tags[tag].getColour();
		
		// Button to delete this tag
		let tagClose = document.createElement("i");
		tagClose.classList.add("mdi", "mdi-close-circle");
		tagClose.addEventListener("click", ()=>{
			comp.removeTag(tag);
			rebuildInspector();
		});
		
		tagEle.appendChild(tagClose);
		tagsSection.appendChild(tagEle);
	}
	
	// Button top add a new tag
	let addTagButton = document.createElement("button");
	addTagButton.classList.add("addTagButton");
	addTagButton.innerHTML = "+";
	addTagButton.addEventListener("click", () => {			
		let popUp = openPopUp(addTagButton, 200, 240, true);
		
		// Create a list of existing tags
		let datalist = ``;
		for (let k of Object.keys(Tag.tags)) {
			if (!comp.tags.includes(k)) {
				datalist += `<option data-id="${Tag.tags[k].id}">${Tag.tags[k].name}</option>`;
			}
		}
		
		// Create a list of tag types
		let tagTypes = ``;
		for (let k of Object.keys(Tag.tagTypes)) {
			tagTypes += `<option value="${k}">${Tag.tagTypes[k].getName()}</option>`;
		}
		
		// Create the basic HTML for the pop-up
		popUp.insertAdjacentHTML("beforeend", `
			<strong>Choose an existing tag...</strong><br>
			<datalist id="tagOptions">
				${datalist}
			</datalist>
			<input type="text" list="tagOptions" style="margin-top:5px;" id="existingTag">
			<br><br><strong>...or make a new one</strong><br><label>Tag Name<label><br>
			<input type="text" style="margin-top:5px;" id="newTagName">
			<br><br><label>Tag Type</label><br>
			<select id="newTagType">
				${tagTypes}
			</select>
		`);
		
		// Create the button which _actually_ makes the tag
		let goButton = document.createElement("button");
		goButton.innerText = "Add";
		goButton.classList.add("buttonDefault");
		goButton.style.width = "70%";
		goButton.style.margin = "10px auto 0";
		
		goButton.addEventListener("click", ()=>{
			let idToAdd = null;
			// If they haven't entered an existing tag -> make a new one
			if (existingTag.value == "") {
				// Entered nothing -> do nothing
				if (newTagName.value == "") return;
				
				// Ensure there is no tag which already has this name
				for (let k of Object.keys(Tag.tags)) {
					if (Tag.tags[k].name == newTagName.value) return;
				}
				
				// Ensure we can still add an tag with this tag type (e.g. haven't hit the maximum)
				if (isOverMaximumAmtOfTags(Tag.tagTypes[newTagType.value], comp)) return;
				
				// Add the tag
				idToAdd = new Tag.tagTypes[newTagType.value](newTagName.value).id + "";
			}
			// Otherwise, they are adding an existing tag
			else {
				// Check that the tag really does already exist
				let tag = Array.from($("#tagOptions option")).filter(val=>val.value==existingTag.value)[0];
				if (tag != undefined) {
					idToAdd = tag.getAttribute("data-id");
					
					// Ensure we can still add an tag with this tag type (e.g. haven't hit the maximum)
					if (isOverMaximumAmtOfTags(Tag.tags[idToAdd].constructor, comp)) return;
				}
			}
			
			// Add the tag
			if (idToAdd != null) {
				comp.tags.push(idToAdd);
				rebuildInspector();
				closeOverlay();
			}
		});
		popUp.appendChild(goButton);
	});
	
	tagsSection.appendChild(addTagButton);
	tagsContainer.appendChild(tagsSection);
	elem.appendChild(tagsContainer);
}

function isOverMaximumAmtOfTags(tag, comp) {
	let maxAmt = tag.getMaxPerElement();
	return maxAmt > -1 && comp.tags.reduce((acc, val)=>acc+(Tag.tags[val].constructor == tag), 0) >= maxAmt;
}