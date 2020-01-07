<?php

session_start();

?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title></title>
		<script>
			
			let components = {};
			
			// Loads in the users settings
			const USER_PREFERENCES = <?= isset($_SESSION['settings']) ? $_SESSION['settings'] : "{}" ?>;
			
			<?php
			function allFiles($path, $f) {
				foreach (scandir($path) as $file) {
					if ($file[0] == ".")            continue;
					else if (is_dir($path . $file)) continue;
					$name = explode(".", $file);
					array_pop($name);
					$name = strtoupper(implode(".", $name));
					?><?=$name?>: `<?=$f($file, $name, $path)?>`,<?php
				}
			}
			
			function rightsEnum() {
				$rights = explode("\n", str_replace("\r", "\n", file_get_contents("./private/rights.txt")));
				foreach ($rights as $right) {
					?><?=$right?>: "<?=$right?>",<?php
				}
			}
			
			function recurseIncludeJS($path) {
				$js = scandir($path);
				foreach ($js as $jsFile) {
					if ($jsFile[0] == ".") continue;
					else if (is_dir($path . $jsFile)) recurseIncludeJS($path . $jsFile . "/");
					else echo file_get_contents($path . $jsFile) . "\n\n";
				}
			}

			// Include the JavaScript for every file in private/client/``
			recurseIncludeJS("./private/client/");
			
			?>
			
			const Network = {
				<?= allFiles("./private/server/", function($file, $name, $path) {
					return $name;
				}) ?>
			};
			const UI = {
				<?= allFiles("./private/component/", function($file, $name, $path) {
					return file_get_contents($path . $file);
				}) ?>
			};
			const Rights = {
				<?=rightsEnum();?>
			}
			const UserRights = new Set("<?=isset($_SESSION["rights"]) ? $_SESSION["rights"] : ""?>".split(","));
			
			// Function to check if the user is logged in or not
			function isLoggedIn() {
				return <?= isset($_SESSION["email"]) ? "true" : "false" ?>;
			}
			
		</script>
		<style id="css"></style>
	</head>
	<body>

	</body>
</html>