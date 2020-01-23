const Environment = {
	doWidth: true,
	width: 0,
	
	doDarkMode: true,
	isDarkMode: false,
	
	doReduceMotion: true,
	isReducedMotion: false
}

const EmulatedEnvironment = {
	doWidth: false,
	width: 1280,
	
	doDarkMode: false,
	isDarkMode: true,
	
	doReduceMotion: false,
	isReducedMotion: true
}

let env = IN_EDIT_MODE ? EmulatedEnvironment : Environment;

let environmentHasChanged = true;

function evFromEmulation() {
	let evs = [];
	
	if (EmulatedEnvironment.doWidth)        evs.push(new EVScreenWidth(EmulatedEnvironment.width));
	if (EmulatedEnvironment.doDarkMode)     evs.push(new EVDarkMode(EmulatedEnvironment.isDarkMode));
	if (EmulatedEnvironment.doReduceMotion) evs.push(new EVReduceMotion(EmulatedEnvironment.isReducedMotion));
	
	if (evs.length == 0)      return new EVNormal();
	else if (evs.length == 1) return evs[0];
	else                      return new EVMultiple(evs);
	
}