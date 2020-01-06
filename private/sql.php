<?php
/**
* Implements some utility functions for MySQL, including a sanitized way to run queries
* @author Orlando Parisblue
*/

const SHOW_ERRORED_SQL = true; //If true, when a MySQL error arrises, the error will be displayed on the page. NOTE TURN THIS SETTING TO FALSE WHEN IN PRODUCTIONS AS IT POSES A SECURITY RISK!!!

const ACCOUNTS = [
	[
		"host"=>"127.0.0.1",
		"user"=>"root",
		"password"=>"",
		"database"=>"uisf"
	]
]; //A 2d array containing key value pairs for each database account which exists. Each account is represented by an assoc array, containing a "host", "user", "password", and "database" for the account

const ACCOUNT_NUMBER = 0; //The index of the database account to use (which position is it's array in in the ACCOUNTS array)

$loginData = ACCOUNTS[ACCOUNT_NUMBER]; //Get the associative array of login information for this account

$dbc = null;

if (isset($doSQLConnect)) {
	$dbc = mysqli_init(); //Securely initilize a database connection

	//If required, more options could be configured here - for example increasing the max packet size

	mysqli_real_connect($dbc, $loginData["host"], $loginData["user"], $loginData["password"], $loginData["database"]) or die("Cannot connect to ".$loginData["database"]); //Attempt to connect to the database using the given credentials, otherwise give back the MySQL error message
}

/*
Run a sanitized MySQL query on the database.

Takes three parameters, the query (with user-inputted data represented by the "?" symbol), a string representing the data-types used in the same format as would be used for mysqli_stmt_bind_param, and then an array containing the data to replace the question-marks with, which will happen in respective order to their position in the query and the array.

Returns an array containing every row returned by the query as an assoc array
*/
function sql($query, $types, $data) {
	global $dbc;

	$stmt = mysqli_stmt_init($dbc);

	mysqli_stmt_prepare($stmt, $query) or die((SHOW_ERRORED_SQL)?("Prepare <code>$query</code> Failed: ".mysqli_stmt_error($stmt)):"Prepare failed"); //Begin the creation of a prepared statement, and if it fails, die with the error message.

	if (count($data)>0) { //If there is any data, then we need to send it (but there doesn't need to be - we may want to run a query like SELECT * FROM users, for example)
		$params = [$stmt, $types]; //$params will contain all of the parameters that we will want to send to mysqli_stmt_bind_param. Here, we initialise it by putting in the first two parameters: the link to $stmt, and the $types variable
		for ($i=0;$i<count($data);$i++) { //Loop through the array of data that we want to send
			$params[] = &$data[$i]; //Add an item to the array of parameters which is the reference to that item in the $data array
		}

		call_user_func_array("mysqli_stmt_bind_param", $params); //Call mysqli_stmt_bind_param, with the $params array as the set of parameters to use. This now means that the markers are bound to the parameters of this statement - i.e. we have defined the set of data that we want to send
	}

	$success = mysqli_stmt_execute($stmt) or die((SHOW_ERRORED_SQL)?("Execute Failed: ".mysqli_stmt_error($stmt)):"Execute failed"); //Execute the query, and if it fails, die with the error message

	$result = mysqli_stmt_get_result($stmt);

	if (is_bool($result)||mysqli_num_rows($result)==0) { //If there are no results, then we can just return an empty array. Also ensures that queries which do no return results (i.e. INSERT, UPDATE, DELETE, etc) and queries that have failed are not asked for their rows
		return [];
	}

	$results = []; //Create an array to store all of the result rows in

	while ($row = mysqli_fetch_assoc($result)) { //While there are still results...
		$results[] = $row; //...add them to the array
	}

	mysqli_stmt_close($stmt);

	return $results;
}

/*
Returns true if the rows array has one or more items in it.
*/
function sqlHasResults($rows) {
	return count($rows) > 0; //Count the rows, and check that the result is greater than 0
}

/*
Get the ID of the last row that was inserted
*/
function sqlRowID() {
	global $dbc; //Get access to the database connection
	return mysqli_insert_id($dbc);
}

?>