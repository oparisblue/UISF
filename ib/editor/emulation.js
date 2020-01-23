function emulationPopup() {	
	let popUp = openPopUp($(".emuButton"), 300, 240, false);
	$("#popUp").innerHTML = `
		<table class="emulateTable">
			<tr>
				<td>
					<input type="checkbox" ${env.doWidth ? "checked" : ""} onclick="emuToggle('doWidth')">
				</td>
				<td>Screen Size:</td>
				<td>
					<input type="range" min="0" max="1280" value="${env.width}" oninput="emuSet('width', parseInt(this.value))">
				</td>
			</tr>
			<tr>
				<td>
					<input type="checkbox" ${env.doDarkMode ? "checked" : ""} onclick="emuToggle('doDarkMode')">
				</td>
				<td>Dark Mode:</td>
				<td>
					<select onchange="emuSet('isDarkMode', this.value == 'dark')">
						<option selected value="dark">Dark</option>
						<option>Light</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>
					<input type="checkbox" ${env.doReduceMotion ? "checked" : ""} onclick="emuToggle('doReduceMotion')">
				</td>
				<td>Reduce Motion:</td>
				<td>
					<select onchange="emuSet('isReducedMotion', this.value == 'reduce')">
						<option selected value="reduce">Reduce</option>
						<option>Normal</option>
					</select>
				</td>
			</tr>
		</table>
	`;
}

function emuToggle(prop) {
	emuSet(prop, !env[prop]);
}

function emuSet(prop, val) {
	env[prop] = val;
	environmentHasChanged = true;
	$("#emuButtonEnvDisplay").innerHTML = evFromEmulation().getEmulationTitle();
}