<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<link href="https://cdn.materialdesignicons.com/4.7.95/css/materialdesignicons.min.css
" rel="stylesheet" type="text/css" media="none" onload="media='all'">
		<link rel="stylesheet" href="editor.css">
		<link rel="stylesheet" href="common.css">
		
		<script>
			<?php 
			
			function recurseInclude($path) {
				$s = scandir($path);
				foreach ($s as $p) {
					$pth = $path . "/" . $p;
					if ($p[0] == ".") continue;
					else if (is_dir($pth)) recurseInclude($pth);
					else echo file_get_contents($pth) . "\n\n";
				}
			}
			
			recurseInclude("./editor/");
			recurseInclude("./common/");
			
			?>
		</script>
		
		
		<title>Scaffold</title>
	</head>
	<body>
		<div id="popUp" class="popUp" style="display: none;"></div>
		<div id="main" onmousedown="editSelectNode(null)" oncontextmenu="return false;"></div>
		<div id="inspector">
			<div class="editorTabs">
				<div class="editorTab editorTabSelected" onclick="swapTab(0)" id="tabSwapper0" title="Properties"><i class="mdi mdi-tune"></i></div>
				<div class="editorTab" onclick="swapTab(1)" id="tabSwapper1" title="Environment Variables"><i class="mdi mdi-monitor-screenshot"></i></div>
				<div class="editorTab" onclick="swapTab(2)"  id="tabSwapper2" title="Quick Help"><i class="mdi mdi-book-open-page-variant"></i></div>
				<div class="editorTab" onclick="swapTab(3)"  id="tabSwapper3" title="Outline"><i class="mdi mdi-file-tree"></i></div>
			</div>
			<div class="editorTabContent">
				<div id="tab0"></div>
				<div id="tab1" style="display:none;"></div>
				<div id="tab2" style="display:none;"></div>
				<div id="tab3" style="display:none;"></div>
			</div>
		</div>
		<div id="toolbar">
			<button><i class="mdi mdi-file"></i> New</button>
			<button><i class="mdi mdi-content-save"></i> Save</button>
			<button><i class="mdi mdi-folder-open"></i> Open</button>
			|
			<button onclick="openComponentLibrary();"><i class="mdi mdi-plus"></i> Add Component</button>
			|
			<button><i class="mdi mdi-earth"></i> Localise</button>
			|
			<button class="emuButton" onclick="emulationPopup();">
				<div class="emuTitle"><i class="mdi mdi-monitor-screenshot"></i> Emulation</div>&#8203;
				<div class="emuTitle">none</div>
				<!--<div class="emuScreenSize">width <= 500</div>
				<div class="emuRights">Is Pro = true</div>
				<div class="emuEnvVar">Edit Mode = true</div>
				<div class="emuAccess">Light Mode = true</div>-->
			</button>
			<button class="editorRightAlign" onclick="window.open('./manual.php')"><i class="mdi mdi-book-open-page-variant"></i> Manual</button>
		</div>
		<div id="overlay" onmousedown="closeOverlay();" oncontextmenu="return false;"></div>
		<div id="rightClickMenu" oncontextmenu="return false;"></div>
		<canvas id="wires"></canvas>
		<div id="componentLibrary">
			<input type="text" oninput="filterComponentLibrary()" id="componentLibrarySearch" placeholder="Search...">
			<div id="componentLibraryResults"></div>
		</div>
		
		
		<!-- Only for testing tags -->
		<script>
			for (let i = 0; i < 4; i++) {
				new AnyElementTag(`Name${(i + 1)}`).id;
			}
		</script>
		<!--  -->
	</body>
</html>