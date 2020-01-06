<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title></title>
		<script>
			
			let components = {};
		
			<?php 
			
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
		</script>
		<style id="css"></style>
	</head>
	<body>
		
	</body>
</html>