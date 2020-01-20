let dragging = null;
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (event)=>{
	mouseX = event.clientX;
	mouseY = event.clientY;
	
	if (dragging != null) {
		let posX = (mouseX - dragging.xOffset) * (1 + (1 - scale));
		let posY = (mouseY - dragging.yOffset) * (1 + (1 - scale));
		
		if (!dragging.unlimited) {
			posX = Math.min(Math.max(dragging.minX,  posX), dragging.maxX);
			posY = Math.min(Math.max(dragging.minY,  posY), dragging.maxY);
		}
		
		if (dragging.dragX) dragging.element.x = posX;
		if (dragging.dragY) dragging.element.y = posY;
		redoLayout();
	}
});

window.addEventListener("mouseup", ()=>{
	if (dragging != null) {
		dragging = null;
		redoLayout();
	}
	if (IN_EDIT_MODE && draggingWire) {
		draggingWire = null;
		closeOverlay();
		$("#main").classList.remove("wireToElement");
	}
});

function startDragging(ele, dragX = true, dragY = true, unlimited = false) {
	let rect = ele.domNode.getBoundingClientRect();
	dragging = {
		element: ele,
		xOffset: mouseX - rect.left + translateX,
		yOffset: mouseY - rect.top + translateY,
		dragX: dragX,
		dragY: dragY,
		minX: -5,
		minY: -5,
		maxX: ele.domNode.parentNode.offsetWidth - rect.width - 5,
		maxY: ele.domNode.parentNode.offsetHeight - rect.height - 5,
		unlimited: unlimited
	};
}