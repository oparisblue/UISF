function inspectorTitle(elem, comp) {
	let info = comp.constructor.getEditorInfo();
	
	elem.insertAdjacentHTML("beforeEnd", `
		<div class="editorTitle">
			<strong>${info.name}</strong><br>
			<small>${info.description}</small>
		</div>
	`);
}