let activeComponents = [];

let state = {
	"ui": "",
	"uiProps": {},
	"global": {},
	"modals": []
};

window.onload = ()=>{
	
	activeComponents = [
		new components.empty("#main"),
		new components.empty("#ribbon"),
		new components.empty("#modal")
	];
	
	// Add the three main areas to the page. This is the only time we actually append to the body...
	for (let comp of activeComponents) {
		document.body.appendChild(comp.getDOMNode());
	}
	
	//activeComponents[0].addChild(new components.label(new CompData("Hello, world!"), "title"));
	activeComponents[0] = parseUIToComponent(UI.BASIC);
	
	window.requestAnimationFrame(render);
}

let prevCSS = ``;

function render() {
	
	let css = ``;
	for (let component of activeComponents) css += component.onTick();
	if (css != prevCSS) document.getElementById("css").innerHTML = css;
	prevCSS = css;
	
	window.requestAnimationFrame(render);
}