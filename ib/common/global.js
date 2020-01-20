let pageComponents = {};
let timeLastFrame = Date.now();
let deltaTime;

// Used for panning and zooming in the editor
let translateX = 0;
let translateY = 0;
let scale = 1;