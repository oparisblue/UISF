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

function addCompToPage(comp) {
	
	comp.addConstraint(new ConstraintWidth(-1, comp.getDefaultWidth()));
	comp.addConstraint(new ConstraintHeight(-1, comp.getDefaultHeight()));
	
	pageComponents[comp.id] = comp;
	$("#main").appendChild(comp.domNode);
	editSelectNode(comp);
	
	comp.x = mouseX - (comp.getDefaultWidth() / 2);
	comp.y = mouseY - (comp.getDefaultHeight() / 2);
	redoLayout();
	startDragging(comp, true, true, true);
}

window.addEventListener("load", ()=>{
	let btn = new ComponentButton();
	pageComponents[0] = btn;
	$("#main").appendChild(btn.domNode);
	
	let btn2 = new ComponentButton();
	pageComponents[1] = btn2;
	$("#main").appendChild(btn2.domNode);
	
	pageComponents["0"].addConstraint(new ConstraintAlign(-1, Direction.LEFT, -1, 300));
	pageComponents["0"].addConstraint(new ConstraintAlign(-1, Direction.RIGHT, -1, 400));
	pageComponents["0"].addConstraint(new ConstraintAlign(-1, Direction.TOP, -1, 100));
	pageComponents["0"].addConstraint(new ConstraintHeight(-1, 20));
	
	pageComponents["1"].addConstraint(new ConstraintWidth(-1, 100));
	pageComponents["1"].addConstraint(new ConstraintHeight(-1, 100));
	pageComponents["1"].addConstraint(new ConstraintAlign(-1, Direction.TOP, 0, 10));
	
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
	
	if (node != null) {
		node.domNode.classList.add("editorSelected");
		rebuildInspector();
	}
}

function rebuildInspector() {
	$("#tab0").innerHTML = "";
	$("#tab0").appendChild(node.getInspector(selectedElement));
}

function closeOverlay() {
	$("#overlay").style.display = "none";
	$("#rightClickMenu").style.display = "none";
}