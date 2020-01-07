<?php

/**
* Handles the log out network requests.
* @author Simon Watson
*/

function inputFormat() {
	return [];
}

function onRequest() {
	session_unset();
	session_destroy();
}

?>