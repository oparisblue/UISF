<?php

/**
* An InputFormatter takes an unvalided input, and provides ways to ensure it matches a given format. If the input is invalid, an user-readable error is thrown, which is able to be passed back to the client.
* All methods return the class to allow for easy constructing. Example use:
* <code>new InputFormatter($_POST["username"], "Username")->length(6, 12)->lower()->notMatches("admin")->get();</code>
* The call to <code>get()</code> collapses the formatter back to a string or number, with any modifications applied.
* @author Simon Watson
*/
class InputFormatter {
	private $input;

	/**
	* Create an input formatter for the given string.
	* @param {string}input The input to format.
	* @param {string}niceName The name to use when referring to this field in error messages.
	*/
	public function __construct($input, $niceName) {
		$this->input    = $input;
		$this->niceName = $niceName;
	}

	/**
	* Collapse the input formatter to a value after all checks and mutations have been made.
	* @return {any} The final value of the formatter.
	*/
	public function get() {
		return $this->input;
	}

	/**
	* Check if the length of the input string is within the given range.
	* @param {number}min The <b>minimum</b> amount of characters for the string.
	* @param {number}max The <b>maximum</b> amount of characters for the string.
	*/
	public function length($min, $max) {
		minLength($min);
		maxLength($max);
		return $this;
	}

	/**
	* Check if the length of the input string is at least n characters.
	* @param {number}min The <b>minimum</b> amount of characters the string needs to be.
	*/
	public function minLength($min) {
		if (strlen($this->input) < $min)
			throw new Exception("$this->niceName must have at least $min characters!");
		return $this;
	}

	/**
	* Check if the length of the input string is at most n characters.
	* @param {number}max The <b>maximum</b> amount of characters the string needs to be.
	*/
	public function maxLength($max) {
		if (strlen($this->input) > $max)
			throw new Exception("$this->niceName must have at most $max characters!");
		return $this;
	}

	/**
	* Check if the input exactly matches the given value.
	* @param {any}value The value the input must match.
	*/
	public function matches($value) {
		if ($this->input != $value)
			throw new Exception("$this->niceName must match \"$value\"!");
		return $this;
	}

	/**
	* Check if the input doesn't exactly match the given value.
	* @param {any}value The value the input can't match.
	*/
	public function notMatches($value) {
		if ($this->input == $value)
			throw new Exception("$this->niceName can't match \"$value\"!");
		return $this;
	}

	/**
	* Check if the the input is an enum of the given set (e.g. in an array).
	* @param {array}array An array of all possible enum values.
	*/
	public function enum($array) {
		if (!in_array($this->input, $array))
			throw new Exception("$this->niceName must be one of " . implode($array, ", ") . "!");
		return $this;
	}

	/**
	* Check if the the input is not an enum of the given set (e.g. not in an array).
	* @param {array}array An array of all possible enum values.
	*/
	public function notEnum($array) {
		if (in_array($this->input, $array))
			throw new Exception("$this->niceName can't be one of " . implode($array, ", ") . "!");
		return $this;
	}

	/**
	* Check if the given SQL query returns at least 1 row when given the value as input.
	* <strong>Note:</strong> the SQL query should contain exactly 1 wildcard value <code>?</code>.
	* @param {string}query The SQL query to run.
	*/
	public function sqlMatches($query) {
		if (!sqlHasResults(sql($query, is_numeric($this->input ? 'i' : 's'), [$this->input])))
			throw new Exception("$this->niceName \"$this->input\" already exists!");
		return $this;
	}

	/**
	* Check if the given SQL query returns exactly 0 rows when given the value as input.
	* <strong>Note:</strong> the SQL query should contain exactly 1 wildcard value <code>?</code>.
	* @param {string}query The SQL query to run.
	*/
	public function notSqlMatches($query) {
		if (sqlHasResults(sql($query, is_numeric($this->input ? 'i' : 's'), [$this->input])))
			throw new Exception("$this->niceName \"$this->input\" cannot be found!");
		return $this;
	}

	/**
	* Ensures the input is a number, then converts its type.
	*/
	public function num() {
		if (!is_numeric($this->input))
			throw new Exception("$this->niceName must be a number!");
		$this->input = parse_float($this->input);
		return $this;
	}

	/**
	* Check if the input is greater than the given number.
	* @param {num}number The number to check the input against.
	*/
	public function gt($number) {
		if ($this->input <= $number)
			throw new Exception("$this->niceName must be greater than $number!");
		return $this;
	}

	/**
	* Check if the input is lesser than the given number.
	* @param {num}number The number to check the input against.
	*/
	public function lt($number) {
		if ($this->input >= $number)
			throw new Exception("$this->niceName must be lesser than $number!");
		return $this;
	}

	/**
	* Check if the input is a valid email address.
	*/
	public function email() {
		if (!filter_var($this->input, FILTER_VALIDATE_EMAIL))
			throw new Exception(htmlentities($this->input) . " is not valid email address!");
		return $this;
	}

	/**
	* Check if the hash of the input matches a given password hash.
	* @param {string}hashedPassword The hashed password to verify the input against.
	*/
	public function passwordMatches($hashedPassword) {
		if (!password_verify($this->input, $hashedPassword))
			throw new Exception("Invalid Password!");
		return $this;
	}

	/**
	* Hash the input to form a valid password hash.
	*/
	public function passwordHash() {
		$this->input = password_hash($this->input, PASSWORD_DEFAULT);
		return $this;
	}

	/**
	* Convert the input to lower case.
	*/
	public function lower() {
		$this->input = strtolower($this->input);
	}

	/**
	* Convert the input to upper case.
	*/
	public function upper() {
		$this->input = strtoupper($this->input);
	}

	/**
	* Run a lambda function. If it doesn't return <code>true</code> fail with the given message.
	* @param {lambda}func The function to run. <b>Must</b> return a boolean.
	* @param {string}msg The message to thrown if the function returns <code>false</code>.
	*/
	public function predicate($func, $msg) {
		if (!$func($this->input))
			throw new Exception($msg);
		return $this;
	}

	/**
	* Check if the input matches a RegEx.
	* @param {string}options The RegEx.
	*/
	public function regex($options) {
		if (!preg_match($options, $this->input))
			throw new Exception("$this->niceName is in an invalid format!");
		return $this;
	}

	/**
	* Check if a given value appears somewhere in the input.
	* @param {string}string The value which should exist in the input.
	*/
	public function includes($string) {
		if (!strpos($this->input, $string))
			throw new Exception("$this->niceName must contain \"$string\"!");
		return $this;
	}

	/**
	* Check that the input is not empty.
	*/
	public function notEmpty() {
		if ($this->input == "")
			throw new Exception("Please enter a $this->niceName!");
		return $this;
	}
	
	/**
	* Check if the input is valid JSON.
	*/
	public function isValidJSON() {
		$testJSON = json_decode($this->input);
		if (json_last_error() !== 0) 
			throw new Exception("JSON is not valid");
		return $this;
	}
}

?>