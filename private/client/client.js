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
	
	setScreen(UI.BASIC);
	
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