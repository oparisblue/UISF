window.addEventListener("load", ()=>{
	window.requestAnimationFrame(render);
});

function render() {
	let timeThisFrame = Date.now();
	deltaTime = timeThisFrame - timeLastFrame;
	timeLastFrame = timeThisFrame;
	
	for (let component of Object.keys(pageComponents)) {
		pageComponents[component].onUpdateTick();
	}
	
	if (IN_EDIT_MODE) editorWireRender();
	
	window.requestAnimationFrame(render);
}