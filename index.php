<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title></title>
		<script>
			<?php

			// Goes through the serer folder and adds each file as a Network request for JS
			$serverFiles = scandir("./private/server/");
			$requestObj = "{";
			foreach ($serverFiles as $serverFile) {
				if ($serverFile[0] == ".") continue;
				else if (strpos($serverFile, ".php")) {
					$fileName = substr($serverFile, 0, strrpos($serverFile, "."));
					$requestObj .= "$fileName: \"$fileName\",";
				}
			}
			$requestObj .= "};\n\n";
			echo "const Network = $requestObj";

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
	</head>
	<body>

	</body>
</html>