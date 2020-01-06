<?php

/**
* @author Simon Watson
* The class for formatting all inputs passed into each AJAX request.
*/

class InputFormatter {
	private $input;

	/**
	* The __construct function sets the input string to be used in the class.
	* @param {string}input The input to format.
	*/
	public function __construct($input) {
		$this->input = $input;
	}

	/**
	* The get function returns the input after all checks and mutations have been made.
	*/
	public function get() {
		return $this->input;
	}

	/**
	* The length function checks if the length of the input string is within the given parameters.
	* @param {num}min The <b>minimum</b> amount of characters the string needs to be.
	* @param {num}max The <b>maximum</b> amount of characters the string needs to be.
	*/
	public function length($min, $max) {
		minLength($min);
		maxLength($max);
		return $this;
	}

	/**
	* The minLength function checks if the length of the input string is greater than the minimum amount of characters.
	* @param {num}min The <b>minimum</b> amount of characters the string needs to be.
	*/
	public function minLength($min) {
		if (strlen($this->input) < $min) throw new Exception("Input must have at least $min characters.");
		return $this;
	}

	/**
	* The maxLength function checks if the length of the input string is less than the maximum amount of characters.
	* @param {num}max The <b>maximum</b> amount of characters the string needs to be.
	*/
	public function maxLength($max) {
		if (strlen($this->input) > $max) throw new Exception("Input must be less then $max characters.");
		return $this;
	}

	/**
	* The matches function checks if the input matches the given value.
	* @param {any}value The value that gets checked with the input.
	*/
	public function matches($value) {
		if ($this->input != $value) throw new Exception("Input does not match.");
		return $this;
	}

	/**
	* The notMatches function checks if the input does not match the given value.
	* @param {any}value The value that gets checked with the input.
	*/
	public function notMatches($value) {
		if ($this->input == $value) throw new Exception("Input does match.");
		return $this;
	}

	/**
	* The enum function checks to see if the input is in the given array.
	* @param {array}array The array that the input gets checked past.
	*/
	public function enum($array) {
		if (!in_array($this->input, $array)) throw new Exception("Input is not in the array");
		return $this;
	}

	/**
	* The notEnum function checks to see if the input is not in the given array.
	* @param {array}array The array that the input gets checked past.
	*/
	public function notEnum($array) {
		if (in_array($this->input, $array)) throw new Exception("Input is in the array");
		return $this;
	}

	/**
	* The sqlMatches function checks to see if the input matches the result of the SQL query.
	* @param {string}query The SQL query that gets run.
	*/
	public function sqlMatches($query) {
		if (!sqlHasResults(sql($query, is_numeric($this->input ? 'i' : 's'), [$this->input])))
			throw new Exception("Query result does not match input");
		return $this;
	}

	/**
	* The sqlMatches function checks to see if the input does not match the result of the SQL query.
	* @param {string}query The SQL query that gets run.
	*/
	public function notSqlMatches($query) {
		if (sqlHasResults(sql($query, is_numeric($this->input ? 'i' : 's'), [$this->input])))
			throw new Exception("Query result does match input");
		return $this;
	}

	/**
	* The num function will convert the input string into a float for future use.
	*/
	public function num() {
		if (!is_numeric($this->input)) throw new Exception("The input is not numeric");
		$this->input = parse_float($this->input);
		return $this;
	}

	/**
	* The gt function checks if the input is greater than the given number.
	* @param {num}number The number that is checked if input is greater than it.
	*/
	public function gt($number) {
		if ($this->input < $number) throw new Exception("The input is not greater than $number");
		return $this;
	}

	/**
	* The lt function checks if the input is less than the given number.
	* @param {num}number The number that is checked if input is less than it.
	*/
	public function lt($number) {
		if ($this->input > $number) throw new Exception("The input is not less than $number");
		return $this;
	}

	/**
	* The email function checks to see if the input is a valid email.
	*/
	public function email() {
		if (!filter_var($this->input, FILTER_VALIDATE_EMAIL))
			throw new Exception("The email " . $this->input . " is not valid email address");
		return $this;
	}

	/**
	* The passwordMatches funciton checks to see if the input matches the a hashed string.
	* @param {string}hashedPassword The hased password that gets checked if input is valid.
	*/
	public function passwordMatches($hasedPassword) {
		if (!password_verify($this->input, $hasedPassword)) throw new Exception("Input is not a valid password");
		return $this;
	}

	/**
	* The passwordHash function will set the input to a hased version of its self.
	*/
	public function passwordHash() {
		$this->input = password_hash($this->input, PASSWORD_DEFAULT);
		return $this;
	}

	/**
	* The lower function sets the input to be all lower case.
	*/
	public function lowwer() {
		$this->input = strtolower($this->input);
	}

	/**
	* The upper function sets the input to be all upper case.
	*/
	public function upper() {
		$this->input = strtoupper($this->input);
	}

	/**
	* The predicate function runs a custom anonymise function.
	* @param {lambda}func The function that gets run. <b>Must</b> return true or false.
	* @param {string}msg The message that gets thrown if the function returns false.
	*/
	public function predicate($func, $msg) {
		if (!$func($this->input)) throw new Exception($msg);
		return $this;
	}

	/**
	* The regex function runs a custom regex on the input based off the options provided.
	* @param {string}options The regex option string.
	*/
	public function regex($options) {
		if (!preg_match($options, $this->input)) throw new Exception("The regex does not match");
		return $this;
	}

	/**
	* The includes function checks to see if the given value is in the input.
	* @param {string}string The value that gets check if it is in the input.
	*/
	public function includes ($string) {
		if (!strpos($this->input, '$string')) throw new Exception("The value '$string' is not in the input");
		return $this;
	}

	/**
	* The notEmpty function checks to see if the input is empty.
	*/
	public function notEmpty() {
		if (!is_numeric($this->input) && $this->input != "") throw new Exception("The input is empty");
		return $this;
	}
}

?>