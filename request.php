<?php

/**
* @author Simon Watson
*
* Handles any JS Ajax requests
*/

session_start();

require("./private/sql.php");
require("./priavte/inputFormatter.php");

$_POST["handler"] = 'HELLO';

if (!isset($_POST["handler"])) die("Handler is not set.");

if (!preg_match("/[A-Z_]/", $_POST["handler"])) die("Invalid input.");

if (is_dir("./private/server")) require("./private/server/" . $_POST["handler"] . ".php");
else die("Invalid Command.");

?>