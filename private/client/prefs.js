/**
* Functions for getting and setting user preferences.
* @author Simon Watson
*/

/**
* The getPreference function gets the users preference value, or the default preference value.
* @param {object}preference The preference that the user wants to check the value of.
*/
function getPreference(preference) {
	return USER_PREFERENCES.hasOwnProperty(preference.key) ? USER_PREFERENCES[preference.key] : preference.default;
}

/**
* The setPreference function sets a value for a preference that the user wants to change.
* @param {object}preference The preference that the user wants to change.
* @param {any}value The new value of the preference that the user changes.
*/
function setPreference(preference, value) {
	USER_PREFERENCES[preference.key] = value;
	request(Network.UPDATE_PREFS, {"prefs":JSON.stringify(USER_PREFERENCES)}); // TODO: Add confermation message once server had processed
}