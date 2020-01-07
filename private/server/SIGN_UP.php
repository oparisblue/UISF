<?php

/**
* Handles the sign up network requests.
* @author Simon Watson
*/

function inputFormat() {
	return [
		"email",
		function ($if) { $if->maxLength(255)->email()->notSqlMatches("SELECT name FROM users WHERE email = ?"); },
		"name",
		function ($if) { $if->maxLength(255); },
		"passwordOne",
		function($if) { $if->minLength(6); },
		"passwordTwo",
		function($if) { $if->matches($_POST["password"])->passwordHash(); }
	];
}

function onRequest($email, $name, $_, $password) {
	$defaultSettings = "{}";
	sql("INSERT INTO users (email, name, password, settings) VALUES (?, ?, ?, ?)", "ssss", [$email, $name, $password, $defaultSettings]);
	
	sql("INSERT INTO userToGroup (users, groups) VALUES (?, ?)", "si", [$email, 1]);
	
	$result = sql("SELECT rights FROM groups INNER JOIN userToGroup ON groups.id = userToGroup.groups WHERE userToGroup.users = ?", 's', [$email]);
	
	if (sqlHasResults($results)) die("Couldn't log you in");
	
	$_SESSION["email"]    = $email;
	$_SESSION["name"]     = $name;
	$_SESSION["settings"] = $defaultSettings;
	$_SESSION["rights"]   = $result[0]["rights"];
}

?>