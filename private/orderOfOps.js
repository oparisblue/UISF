const CANVAS_SIZE = 900;

function setup() {
	createCanvas(CANVAS_SIZE, CANVAS_SIZE);
	ellipseMode(CORNER);
	background(255);
	
	// Red Rectangle
	fill(255, 0, 0);   strokeWeight(3); rect(100, 100, 100, 100);
	
	// Green Circle
	fill(0, 255, 0);   strokeWeight(1); ellipse(100, 220, 100, 100);
	
	// Blue Line
	stroke(0, 0, 255); strokeWeight(5); line(100, 340, 200, 440);
}
function draw() {}