// Editor UI + Editor specific code
//
// For various reasons, the editor does not use its own UI components
// (circular dependancies, issues with them thinking they are in edit mode, etc)
//
// This may change in a future release.
//
// For now, the editor code will be implemented on a case-by-case basis. The editor
// should really be pretty lightweight, so I don't see this being too much of an
// issue.

/**
* Swap the tabs in the inspector.
*/
function swapTab(id) {
	$(".editorTabSelected").classList.remove("editorTabSelected");
	$("#tabSwapper" + id).classList.add("editorTabSelected");
	
	Array.from($(".editorTabContent").children).forEach(x=>{x.style.display = "none"});
	$("#tab" + id).style.display = "block";
}

const IN_EDIT_MODE = true;

const Tools = {
	SELECT: "SELECT",
	PAN: "PAN",
	ZOOM: "ZOOM"
}

let editorTool = Tools.SELECT;
let editorActualTool = Tools.SELECT;

let selectedElement = null;

let ctx;

window.addEventListener("load", ()=>{
	
	let btn = new ComponentButton();
	pageComponents[0] = btn;
	$("#main").appendChild(btn.domNode);
	
	let btn2 = new ComponentButton();
	pageComponents[1] = btn2;
	$("#main").appendChild(btn2.domNode);
	
	pageComponents["0"].addConstraint(Constraint.align(Direction.LEFT, -1, 300));
	pageComponents["0"].addConstraint(Constraint.align(Direction.RIGHT, -1, 400));
	pageComponents["0"].addConstraint(Constraint.align(Direction.TOP, -1, 100));
	pageComponents["0"].addConstraint(Constraint.height(20));
	pageComponents["0"].onUpdateTick();
	
	pageComponents["1"].addConstraint(Constraint.width(100));
	pageComponents["1"].addConstraint(Constraint.height(100));
	pageComponents["1"].addConstraint(Constraint.align(Direction.TOP, 0, 10));
	pageComponents["1"].onUpdateTick();
	
	redoLayout();
	
	// Pan & Zoom

	document.addEventListener("mousewheel", (ev)=>{
		ev.preventDefault();
		ev.stopImmediatePropagation();
		
		// Pinch to zoom in / out
		if (ev.ctrlKey) {
			scale = Math.min(1.75, Math.max(0.25, scale + (-ev.deltaY / 100)));
			$("#main").style.transform = `scale(${scale}, ${scale})`;
		}
		// Pan
		else {
			translateX += -ev.deltaX * (1 + (1 - scale));
			translateY += -ev.deltaY * (1 + (1 - scale));
			redoLayout();
		}
		
		
	}, { passive: false });
	
	// Wire rendering
	$("#wires").width = window.innerWidth;
	$("#wires").height = window.innerHeight;
	ctx = $("#wires").getContext("2d");
	
	//btn.addConstraint(new ConstraintAlign)
});

function editSelectNode(node) {
	if (selectedElement != null) selectedElement.domNode.classList.remove("editorSelected");
	selectedElement = node;
	
	$("#tab0").innerHTML = "";
	if (node != null) {
		node.domNode.classList.add("editorSelected");
		
		// Draw wires
		console.log(node.outlets);
		
		rebuildInspector();
	}
}

function rebuildInspector() {
	$("#tab0").innerHTML = "";
	$("#tab0").appendChild(selectedElement.showInspector());
}

function closeOverlay() {
	$("#overlay").style.display = "none";
	$("#rightClickMenu").style.display = "none";
	$("#popUp").style.display = "none";
	$("#popUp").innerHTML = "";
	$("#componentLibrary").style.display = "none";
}

function openPopUp(button, width, height, belowButton) {
	let popUp = $("#popUp");
	
	$("#overlay").style.display = "block";
	
	popUp.innerHTML = "";
	
	let rect = button.getBoundingClientRect();
	
	popUp.style.left    = `${rect.left + ((rect.width - width) / 2)}px`;
	popUp.style.top     = belowButton ? `${rect.top + rect.height + 20}px` : `${rect.top - height - 20}px`;
	popUp.style.display = "block";
	popUp.style.width   = width + "px";
	popUp.style.height  = height + "px";
	if (!belowButton) popUp.classList.add("popUpAboveButton");
	
	return popUp;
}

function uploadJSONFile() {
	let inp = document.createElement("input");
	inp.type = "file";
	inp.style.display = "none";
	inp.accept = ".json";
	inp.addEventListener("change", (ev)=>{
		let reader = new FileReader();
		reader.onload = (e)=>{
			loadFromJSON(JSON.parse(e.target.result));
		}
		reader.readAsText(ev.target.files[0]);
	});
	document.body.appendChild(inp);
	inp.click();
}