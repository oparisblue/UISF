<?php

function inputFormat() {
	return [
		"prefs",
		function ($if) { $if->isValidJSON(); },
	];
}

function onRequest($prefs) {
	sql("UPDATE users SET settings = ? WHERE email = ?", "ss", [$prefs, $_SESSION["email"]]);
}

?>