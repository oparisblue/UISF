function inspectorFields(elem, comp) {
	let fieldsContainer = document.createElement("div");
	fieldsContainer.classList.add("editorSection");
	fieldsContainer.insertAdjacentHTML("beforeend", `<strong>Fields</strong>`);
	
	let table = document.createElement("table");
	let tbody = document.createElement("tbody");
	for (let field of Object.keys(comp.fields)) {
		let data = comp.fields[field];
		if (data.isInspectorEditable) {
			let row = document.createElement("tr");
			row.insertAdjacentHTML("beforeend", `<td title="${data.description}">${data.name}:</td>`);
			let right = document.createElement("td");
			right.appendChild(data.getInspector(field, this));
			row.appendChild(right);
			tbody.appendChild(row);
		}
	}
	
	table.appendChild(tbody);
	fieldsContainer.appendChild(table);
	elem.appendChild(fieldsContainer);
}