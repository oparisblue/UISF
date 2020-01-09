/**
* 
* @author Orlando
*/
components["topTabBar"] = class ComponentTopTabBar extends Component {
	
	constructor() {
		super(arguments);
		this.domNode = document.createElement("div");
		this.domNode.id = this.id;
		
		this.tabs = [];
		let names = ["Home", "Chat", "Calendar"];
		for (let name of names) {
			let tab = this.makeTab(name);
			this.domNode.appendChild(tab);
			this.tabs.push(tab);
		}
		this.tabs[0].classList.add("topTabSelected");
	}
	
	makeTab(name) {
		let tab = document.createElement("div");
		tab.classList.add("topTab");
		tab.innerHTML = name;			
		tab.addEventListener("mousedown", (ev)=>{
			$(".topTabSelected").classList.remove("topTabSelected");
			tab.classList.add("topTabSelected");			
			draggingTab = tab;
			draggingTabInitialPosition = new Vector(ev.clientX - tab.offsetLeft, ev.clientY - tab.offsetTop);
		});
		return tab;
	}
	
	/**
	* @override
	*/
	onTick() {
		let css = `
			#${this.id} {
				background-color:#03A9F4;
				width:100%;
				height:45px;
				color:#fff;
				user-select:none;
			}
			.topTab {
				background-color:#0288D1;
				cursor:pointer;
				box-sizing:border-box;
				padding:10px;
				height:45px;
				display:flex;
				align-items:center;
				margin-right:2px;
				min-width:100px;
				position:absolute;
			}
			.topTabSelected {
				 background-color:#fff;
				 color:#0288D1;
			}
			.topTab:not(.topTabSelected) {
				transition:left 0.1s linear;
			}
		`;
		
		let space = 0;
		for (let i = 0; i < this.tabs.length; i++) {
			let tab = this.tabs[i];
			if (tab != draggingTab) tab.style.left = space + "px";
			tab.style.zIndex = tab == draggingTab ? "1" : "0";
			space += tab.offsetWidth;
			
			if (
				tab != draggingTab  &&
				draggingTab != null &&
				!tab.classList.contains("transitioning") &&
				tab.offsetLeft < draggingTab.offsetLeft &&
				draggingTab.offsetLeft <= tab.offsetLeft + (tab.offsetWidth / 2)
			) {
				// Swap
				let tmp = this.tabs[i];
				this.tabs[i] = draggingTab;
				this.tabs[i + (i + 1 < this.tabs.length && this.tabs[i + 1] == draggingTab ? 1 : -1)] = tmp;
				tmp.classList.add("transitioning");
				setTimeout(()=>{
					tmp.classList.remove("transitioning");
				}, 200);
				break;
			}
			
		}
		
		return this.doDefaultRender(css);
	}
	
}

let draggingTab = null;
let draggingTabInitialPosition;

window.addEventListener("mousemove", (ev)=>{
	if (draggingTab != null) {
		draggingTab.style.left = (ev.clientX - draggingTabInitialPosition.x) + "px";
	}
});

window.addEventListener("mouseup", ()=>{
	if (draggingTab != null) {
		draggingTab.setAttribute("style", "");
		draggingTab = null;
	}
});