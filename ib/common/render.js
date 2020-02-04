window.addEventListener("load", ()=>{
	window.requestAnimationFrame(render);
});

function render() {
	let timeThisFrame = Date.now();
	deltaTime = timeThisFrame - timeLastFrame;
	timeLastFrame = timeThisFrame;
	
	let envHasChanged = environmentHasChanged;
	
	environmentHasChanged = false;
	
	for (let k of Object.keys(pageComponents)) {	
		let component = pageComponents[k];
		component.envHasChanged = envHasChanged;
		if (component.active && component.parent == null) component.onUpdateTick();
	}
	
	if (IN_EDIT_MODE) editorWireRender();
	
	window.requestAnimationFrame(render);
}