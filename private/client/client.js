let activeComponents = [];

let mainArea; let ribbonArea; let modalArea;


let state = {
	"ui": "",
	"uiProps": {},
	"global": {},
	"modals": []
};

window.onload = ()=>{
	mainArea   = new components.empty("#main");
	ribbonArea = new components.empty("#ribbon");
	modalArea  = new components.empty("#modals");
	
	activeComponents = [mainArea, ribbonArea, modalArea];
	
	// Add the three main areas to the page. This is the only time we actually append to the body...
	for (let comp of activeComponents) {
		document.body.appendChild(comp.getDOMNode());
	}
	
	mainArea.addChild(new components.label(new CompData("Hello, world!"), "title"));
	
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