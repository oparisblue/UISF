<?php

/**
* Handles the log in network requests.
* @author Simon Watson
*/

function inputFormat() {
	return [
		"email",
		function ($if) { $if->maxLength(255)->email()->sqlMatches("SELECT name FROM users WHERE email = ?"); },
		"password",
		function ($if) { $if->passwordMatches(sql("SELECT password FROM users WHERE email = ?", 's', [$_POST["email"]])); },
	];
}

function onRequest($email, $password) {
	$result = sql("SELECT users.name, users.settings, groups.rights FROM ((users INNER JOIN userToGroup ON users.email = userToGroup.users) INNER JOIN groups ON userToGroup.groups = groups.id) WHERE users.email = ?", 's', [$email]);
	
	if (sqlHasResults($results)) die("Couldn't log you in");
	
	$_SESSION["email"]    = $email;
	$_SESSION["name"]     = $results[0]["name"];
	$_SESSION["settings"] = $results[0]["settings"];
	$rights = [];
	foreach ($result as $row) $rights[] = $row["rights"];
	$_SESSION["rights"]   = implode(",", $rights);
}

?>