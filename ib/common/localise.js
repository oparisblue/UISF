// TODO:
// Draw localisation window on button open

let lang = "en_nz";
let validToChange = true;
let localise = {
	en_nz: {
		buttonDone: "Done",
		buttonSubmit: "Submit",
	},
	fr_fr: {
		buttonDone: "Terminé",
		buttonSubmit: "Soumettre"
	},
	jp_jp: {
		buttonDone: "やった",
		buttonSubmit: "参加する"
	}
}

function drawTable() {
	let filter = new RegExp(`.*(${$("#localiseSearch").value}).*`, "i");
	let html = ``;
	for (let k of Object.keys(localise[lang]).sort()) {
		let value = localise[lang][k];
		if (value.match(filter)) {
			html += `
				<div ondragstart="dragStart(event);" ondragend="dragEnd();" draggable="true" class="localiseRow" tabindex="0">
					<div ondblclick="localiseChangeValue(this);">${k}</div>
					<div ondblclick="localiseChangeValue(this);" data-key="${k}">${value}</div>
				</div>
			`;
		}
	}
	$("#localiseBody").innerHTML = html;
}

function changeLanguage(ele) {
	lang = ele.value;
	drawTable();
	environmentHasChanged = true;
}

function addLanguage() {
	let languageCode = $("#localiseNewLanguage").value;
	if (languageCode) {
		if (!localise.hasOwnProperty(languageCode)) {
			let newOption = document.createElement("option");
			newOption.innerText = languageCode;
			$("#languageSelect").appendChild(newOption);
			$("#languageSelect").value = languageCode;
			localise[languageCode] = {};
			lang = languageCode;
			$("#localiseNewLanguage").value = "";
			drawTable();
			environmentHasChanged = true;
		} else console.log("That language already exists");
	} else console.log("You must have a language code to add");
}

function addValue() {
	let newKey = $("#localiseNewKey").value;
	let newValue = $("#localiseNewValue").value;
	
	if (newKey && newValue) {
		if (!localise[lang].hasOwnProperty(newKey)) {
			localise[lang][newKey] = newValue;
			$("#localiseNewKey").value = "";
			$("#localiseNewValue").value = "";
			drawTable();
			environmentHasChanged = true;
		} else console.log("That key already exists");

	} else console.log("You need a key and a value");
}

function localiseChangeValue(ele) {
	let pastEdit = $('.localiseEdit');
	if (pastEdit) {
		if (validToChange) {
			pastEdit.innerHTML = pastEdit.children[0].value;
			pastEdit.classList.remove('localiseEdit');
		} else {
			console.log('You must finish editing the last key first');
			return;
		}
	}
	ele.classList.add('localiseEdit');
	
	let originalValue = ele.innerText;
	let input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.value = originalValue;
	
	if (ele.hasAttribute("data-key")) {
		let localKey = ele.getAttribute('data-key');
		
		input.addEventListener("blur", ()=> {
			localise[lang][localKey] = input.value;
			ele.innerHTML = input.value;
			ele.classList.remove('localiseEdit');
			environmentHasChanged = true;
		});
	} else {
		validToChange = false;
		input.addEventListener("blur", ()=> {
			if (input.value) {
				if (!localise[lang].hasOwnProperty(input.value)) {
					localise[lang][input.value] = localise[lang][originalValue];
					delete localise[lang][originalValue];
					ele.innerHTML = input.value;
					ele.classList.remove('localiseEdit');
					validToChange = true;
					environmentHasChanged = true;
				} else console.log("That key already exists");
			} else console.log("You cant have a empty key");
		});
	}
	
	ele.innerHTML = "";
	ele.appendChild(input);
	input.select();
}

function dragStart(eve) {
	eve.dataTransfer.setData("text/plain", `~${eve.currentTarget.children[0].innerText}`);
	$("#overlay").style.display = "none";
}

function dragEnd() {
	$("#overlay").style.display = "block";
}

function localisationPopup() {
	let options = ``;
	for (let k of Object.keys(localise)) {
		if (k == lang) options += `<option default>${k}</option>`;
		else options += `<option>${k}</option>`;
	}
	openPopUp($("#localiseButton"), 600, 500, false).innerHTML = `
		<div>Choose your language</div>
		<select id="languageSelect" onchange="changeLanguage(this);">
			${options}
		</select>
		<div>Or add a new one</div>
		<div class="localiseNewLanguage">
			<input id="localiseNewLanguage" type="text" placeholder="New Language Code">
			<button onclick="addLanguage();">Add Language</button>
		</div>
		<div class="localiseTable">
			<div class="localiseHead">
				<div class="title">Key</div>
				<div class="title">Value</div>
			</div>
			<div id="localiseBody"></div>
		</div>
		<div class="localiseFooter">
			<input id="localiseSearch" oninput="drawTable()" type="text" placeholder="Search for Value">
			<div>Add a new value</div>
			<div class="localiseNewValue">
				<input id="localiseNewKey" type="text" placeholder="Key">
				<input id="localiseNewValue" type="text" placeholder="Value">
				<button onclick="addValue()">Add Value</button>
			</div>
		</div>
	`;
	drawTable();
}