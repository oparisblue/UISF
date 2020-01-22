function addCompToPage(comp) {
	closeOverlay();
	pageComponents[comp.id] = comp;
	$("#main").appendChild(comp.domNode);
	editSelectNode(comp);
	
	comp.x = mouseX - (comp.getDefaultWidth() / 2);
	comp.y = mouseY - (comp.getDefaultHeight() / 2);
	redoLayout();
	startDragging(comp, true, true, true);
}

function openComponentLibrary() {
	$("#overlay").style.display = "block";
	$("#componentLibrary").style.display = "block";	
	$("#componentLibrarySearch").focus();
	$("#componentLibrarySearch").value = "";
	filterComponentLibrary();
}

function filterComponentLibrary() {
	let filter = new RegExp(`.*(${$("#componentLibrarySearch").value}).*`, "i");
	let html = ``;
	for (let k of Object.keys(components)) {
		let comp = components[k].getEditorInfo();
		if (comp.name.match(filter)) {
			html += `
				<div class="componentLibraryResult" onmousedown="addCompToPage(new components['${k}']);">
					<h1>${comp.name}</h1>
					${comp.description
					}
				</div>
			`;
		}
	}
	$("#componentLibraryResults").innerHTML = html;
	
}