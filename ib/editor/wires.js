let draggingWire = null

function editorDragWire(ele, compId, type, propName) {
	let rect = ele.getBoundingClientRect();
	draggingWire = {
		pos: new Vector(rect.left + (rect.width / 2), rect.top + (rect.height / 2)),
		compId: compId,
		type: type,
		propName: propName,
		drawWire: true
	};
	$("#overlay").style.display = "none";
	$("#main").classList.add("wireToElement");
}

function editorWireRender() {
	// Clear all existing wires
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	ctx.strokeStyle = "#fff";
	
	// Draw the wire being dragged
	if (draggingWire != null && draggingWire.drawWire) {
		ctx.beginPath();
		ctx.moveTo(draggingWire.pos.x, draggingWire.pos.y);
		ctx.lineTo(mouseX, mouseY);
		ctx.stroke();
		ctx.closePath();
	}
}

function editorWireTo(compId, type, propName) {
	pageComponents[draggingWire.compId].addWire(
		draggingWire.propName,
		type == "action" ? "eventListeners" : "outlets",
		compId,
		propName
	);
}