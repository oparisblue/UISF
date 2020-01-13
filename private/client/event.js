let events = {};

/**
* Register a lambda function as a handler for a given event.
* It will be called whenever fireEvent() is called with the same name.
* @param name The name of the event.
* @param func The function to call.
*/
function subscribeEvent(name, func) {
	if (!events.hasOwnProperty(name)) events[name] = [func];
	else events[name].push(func);
}

/**
* Fire the given event, calling all event handlers registered on it.
* @param name The name of the event.
*/
function fireEvent(name) {
	if (events.hasOwnProperty(name)) for (let handler of events[name]) handler();
}