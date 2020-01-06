<?php
/**
* Handles AJAX requests to the server.
* @author Simon Watson
* @author Orlando
*/

session_start();

require("./private/sql.php");
require("./priavte/inputFormatter.php");

$_POST["handler"] = 'HELLO';

function fileName() {
	return "./private/server/" . $_POST["handler"] . ".php";
}

// Check if a handler for this request exists

if (
	!isset($_POST["handler"])                   ||
	!preg_match("/[A-Z_]+/", $_POST["handler"]) ||
	!file_exists(fileName())
) {
	die("Don't know how to handle this input!");
}

// Require the PHP file containing the correct handler
// This file is required to have two functions defined:
//   * inputFormat() returns an array which defines how input should be processed. The array alternates between
//     strings and lambda functions, where the string is the name of the input in $_POST and the lambda function
//     describes how an InputFormatter can ensure that the given input is valid.
//   * onRequest(), which is called only after we find that inputFormat() is valid. This performs any required
//     server-side actions, and is given the validated input.

require(fileName());

$inputs = inputFormat();
$formattedInputs = [];

for ($i = 0; $i < count($inputs); $i += 2) {
	// Create an input formatter for the given $_POST value.
	$if = new InputFormatter($_POST[$inputs[$i]], $inputs[$i]);
	try {
		// Run the lambda to format the input, if there is an error it is caught...
		$inputs[$i + 1]($if);
	}
	catch (Exception $e) {
		// ...give it back to the user
		die($e->getMessage());
	}
	// If there was no error, get the formatted input and add it to then end of our array of formatted inputs
	$formattedInputs[] = $if->get();
}

// Call the onRequest() function with all of the formatted inputs spread as seperate parameters.
echo onRequest(...$formattedInputs);

?>