subscribeEvent("openModal", ()=>{
	modal(UI.MODAL).then((state)=>{
		//alert("You clicked " + ["Cancel", "OK"][state] + "!");
	});
});

subscribeEvent("tryAnimation", ()=>{
	let label = new components["label"](new CompData("Hello There!"));
	label.domNode.setAttribute("style", `position:absolute;left:100px;top:100px;width:300px;height:150px;`);
	label.addAnimation(new BasicAnimation({animation: "pop", to: 1, from:0.5, shakeAmt:20, timingFunc: Easing.bounceIn, reverse: false, duration: 500}));
	activeComponents[0].addChild(label);
});