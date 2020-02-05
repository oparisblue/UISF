function saveToJSON() {
	let json = {
		nextComponentID: Component.nextId,
		components:{}
	};
	
	// Save components
	for (let k of Object.keys(pageComponents)) {
		let comp = pageComponents[k];
		let compJSON = {type: comp.getComponentName(), evs: [], children: comp.children, x: comp.x, y: comp.y};
		
		for (let ev of comp.evs) {
			compJSON.evs.push(ev.toJSON());
		}
		
		json.components[comp.id] = compJSON;
	}
	
	download("data:text/json;base64," + btoa(JSON.stringify(json)), "application.json");
}

function loadFromJSON(json) {
	$("#main").innerHTML = ``;
	pageComponents = {};
	
	let newPageComponents = {};
	
	// Load components
	for (let id of Object.keys(json.components)) {
		let comp = json.components[id];
		let newComp = new components[comp.type]();
		newComp.id = id;
		newComp.children = comp.children;
		newComp.x = x;
		newComp.y = y;
		
		let evs = [];
		
		for (let ev of comp.evs) {
			let newEv = evFromJSON(json);			
			newEv.properties = ev.properties;
			evs.push(newEv);
		}
		
		newComp.evs = evs;
		newComp.hasChanged = true;
		newComp.envHasChanged = true;
		newPageComponents[id] = newComp;
		$("#main").appendChild(newComp.domNode);
	}
	
	Component.nextId = json.nextComponentID;
	pageComponents = newPageComponents;
	setTimeout(redoLayout, 100);
}

function evFromJSON(json) {
	switch (json.type) {
		case "multiple"     : return new EVMultiple(json.others.map(x=>evFromJSON(x)));
		case "darkMode"     : return new EVDarkMode(json.shouldBeTrue);
		case "reduceMotion" : return new EVReduceMotion(json.shouldBeTrue);
		case "screenWidth"  : return new EVScreenWidth(json.size);
		default             : return new EVNormal();
	}
}

function download(data, filename) {
	let a = document.createElement("a");
	a.href = data;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
}