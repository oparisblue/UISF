function AjaxRequest(page, data) {
	return new Promise((resolve, reject) => {
		
		let form_data;
		
		if (data instanceof HTMLFormElement) { //If this is a form; then we can use its data directly
			form_data = new FormData(data);
		}
		else { //Otherwise; treat it is a set of key:value pairs
			form_data = new FormData(); //Create an object to store the data we are submitting
			for (let field in data) { //Loop through the array, and add each field to the form data object
				form_data.append(field, data[field]);
			}
		}

		let request = new XMLHttpRequest();
		request.open("post", page); //Ensure that the data is sent over POST not GET
		request.onreadystatechange = ()=>{ //Event fires whenever the state of the request changes
			if (request.readyState == 4 && request.status == 200) { //Once our request has reached a successful status, we can return the result
				resolve(request.responseText);
			}
			else if (parseInt((request.status + "").slice(0,1)) >= 4) { //If the HTTP response code is in the 400s or above there has been an error with the request
				reject(request.status);
			}
		}
		request.send(form_data);
	});
}