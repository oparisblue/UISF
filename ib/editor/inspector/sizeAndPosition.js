function inspectorSizeAndPosition(elem, _comp) {
	elem.insertAdjacentHTML("beforeend", `
		<div class="editorSection">
			<strong>Size & Position</strong>
			<div class="constraintsBox">
				<div class="constraintRow">
					<input type="number" style="width:50px;">
					<select></select>
				</div>
				<div class="constraintRow">
					<input type="number" style="width:50px;">
					<select></select>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84">
						<defs>
							<style>
								.cls-1 {
									opacity: 0;
									cursor: pointer;
								}
								.constraintIcon {
									fill: #fff;
								}
							</style>
						</defs>
						<g>
							<polygon id="constraintIcon1" class="constraintIcon" points="33 0 51 0 51 2 43 2 43 25 51 25 51 27 33 27 33 25 41 25 41 2 33 2 33 0" />
							<polygon id="constraintIcon2" class="constraintIcon" points="84 33 84 51 82 51 82 43 59 43 59 51 57 51 57 33 59 33 59 41 82 41 82 33 84 33" />
							<polygon id="constraintIcon3" class="constraintIcon" points="33 57 51 57 51 59 43 59 43 82 51 82 51 84 33 84 33 82 41 82 41 59 33 59 33 57" />
							<polygon id="constraintIcon4" class="constraintIcon" points="27 33 27 51 25 51 25 43 2 43 2 51 0 51 0 33 2 33 2 41 25 41 25 33 27 33" />
							<path id="constraintIcon5" class="constraintIcon" d="M42,34.5A7.5,7.5,0,1,0,49.5,42,7.5,7.5,0,0,0,42,34.5ZM42,47a5,5,0,1,1,5-5A5,5,0,0,1,42,47Z" />
							<rect onclick="selectedElement.toggleConstraint(1)" class="cls-1" x="33" width="18" height="27" />
							<rect onclick="selectedElement.toggleConstraint(2)" class="cls-1" x="57" y="33" width="27" height="18" />
							<rect onclick="selectedElement.toggleConstraint(3)" class="cls-1" x="33" y="57" width="18" height="27" />
							<rect onclick="selectedElement.toggleConstraint(4)" class="cls-1" y="33" width="27" height="18" />
							<rect onclick="selectedElement.toggleConstraint(5)" class="cls-1" x="34.5" y="34.5" width="15" height="15" />
						</g>
					</svg>			
					<input type="number" style="width:50px;">
					<select></select>
				</div>
				<div class="constraintRow">
					<input type="number" style="width:50px;">
					<select></select>
				</div>
			</div>
			<div class="widthHeightContainer">
				<div><input type="checkbox"><label>Width:</label><input type="number"></div>
				<div><input type="checkbox"><label>Height:</label><input type="number"></div>
			</div>
			<div class="constraintPositioningBox">
				<div>
					<label for="inspectorCenterX">Center X</label>
					<input type="checkbox" id="inspectorCenterX">
				</div>
				<div>
					<label for="inspectorCenterY">Center Y</label>
					<input type="checkbox" id="inspectorCenterY">
				</div>
				<div>
					<label for="inspectorInvisible">Invisible</label>
					<input type="checkbox" id="inspectorInvisible">
				</div>
			</div>
		</div>	
	`);
}