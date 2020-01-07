<?php
session_start();

if (isset($_POST["clear"])) {
	session_unset();
	session_destroy();
}
else if (isset($_POST["add"])) {
	$_SESSION[$_POST["key"]] = $_POST["value"];
}
?>

<h1>View Session Variables</h1>

<style>
table {
	border-collapse:collapse;
	width:500px;
}
table td, table th {
	border:inset 1px #888;
}
</style>

<table>
	<thead>
		<th>Key</th><th>Value</th>
	</thead>
	<tbody>
		<?php 
		$keys = array_keys($_SESSION);
		foreach ($keys as $k) {
			?>
			<tr><td><a href="#" onclick="key.value=this.innerText;value.focus();"><?=$k?></a></td><td><?=$_SESSION[$k]?></td></tr>
			<?php
		}
		?>
	</tbody>
</table>

<h1>Add a new Session Variable</h1>
<form method="post">
<p><input type="text" placeholder="Key" name="key" id="key"> = <input type="text" placeholder="Value" name="value" id="value"></p>
<button type="submit" name="add">Add</button></form>


<h1>Clear all Session Variables</h1>
<form method="post"><button type="submit" name="clear">Clear all</button></form>