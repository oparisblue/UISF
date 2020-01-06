function request(handler, data) {
	return new Promise((resolve, reject) => {
		
		let formData;
		
		if (data instanceof HTMLFormElement) { //If this is a form; then we can use its data directly
			formData = new FormData(data);
		}
		else { //Otherwise; treat it is a set of key:value pairs
			formData = new FormData(); //Create an object to store the data we are submitting
			for (let field in data) { //Loop through the array, and add each field to the form data object
				formData.append(field, data[field]);
			}
		}
		
		formData.append("handler", handler)

		let request = new XMLHttpRequest();
		request.open("post", "requet.php"); //Ensure that the data is sent over POST not GET
		request.onreadystatechange = ()=>{ //Event fires whenever the state of the request changes
			if (request.readyState == 4 && request.status == 200) { //Once our request has reached a successful status, we can return the result
				resolve(request.responseText);
			}
			else if (parseInt((request.status + "").slice(0,1)) >= 4) { //If the HTTP response code is in the 400s or above there has been an error with the request
				reject(request.status);
			}
		}
		request.send(formData);
	});
}