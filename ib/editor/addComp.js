function openComponentLibrary() {
	if ($("#overlay").style.display == "block") {
		closeOverlay();
		return;
	}
	$("#overlay").style.display = "block";
	$("#componentLibrary").style.display = "block";	
	$("#componentLibrarySearch").focus();
	$("#componentLibrarySearch").value = "";
	filterComponentLibrary();
}

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

window.addEventListener("keydown", (ev)=>{
	let mac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
	if (ev.code == "KeyL" && ((mac && ev.metaKey) || (!mac && ev.ctrlKey))) {
		ev.preventDefault();
		ev.stopPropagation();
		openComponentLibrary();
	}
});