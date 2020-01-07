<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title></title>
		<script>
			
			let components = {};
			
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
				<?=allFiles("./private/server/", function($file, $name, $path) {
					return $name;
				})?>
			};
			const UI = {
				<?=allFiles("./private/component/", function($file, $name, $path) {
					return file_get_contents($path . $file);
				})?>
			};
			
		</script>
		<style id="css"></style>
	</head>
	<body>

	</body>
</html>