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
	
	setScreen(UI.MAIN);
	
	window.requestAnimationFrame(render);
}

let prevCSS = ``;

function render() {
	
	let css = new Set();
	css.add(getDefaultCSS());
	for (let component of activeComponents) css.add(component.onTick());
	let dedupeCSS = Array.from(css).reduce((acc, val)=>acc = acc + val, "");
	if (dedupeCSS != prevCSS) document.getElementById("css").innerHTML = dedupeCSS
	prevCSS = dedupeCSS;
	
	window.requestAnimationFrame(render);
}