document.addEventListener('DOMContentLoaded', function() {
	window.codeTest = (function() {
		var codeTestObj;

		function CodeTest(config) {
			if(typeof config === 'undefined' || !config) { config = {}; }

			this.form = config.form || null;
			this.jsonFormData = {};
		}

		CodeTest.prototype.setForm = function(form) {
			this.form = form;
		};

		// Currently prepares only input and select fields
		CodeTest.prototype.prepareJsonFormData = function() {
			var i, len, currentElement;
			var json = this.jsonFormData;
			var inputs = utils.getNodeElements('tag', 'input', this.form);
			var selects = utils.getNodeElements('tag', 'select', this.form);

			for(i=0, len=inputs.length; i < len; i++) {
				currentElement = inputs[i];
				json[currentElement.id] = currentElement.value;
			}

			for(i=0, len=selects.length; i < len; i++) {
				currentElement = selects[i];
				json[currentElement.id] = currentElement.value;
			}

		};

		// Transform all data in form inputs to JSON 
		CodeTest.prototype.submit = function() {
			if(validator.isValidForm(this.form.id)){
				this.prepareJsonFormData();
				console.log(this.jsonFormData);
			}
		};

		codeTestObj = new CodeTest();

		(function() {
			var firstName, lastName, favoriteFood, favoriteNumber, favoriteDayOfWeek, favoriteColor, 
				separatedSpaceInputDiv, reversedInputDiv, asciiAdditionDiv, secondHighestFactorDiv, 
				nextOcurrencesDiv, colorBoxDiv, element, asciiArray, joinedArray, secondHighestFactor,
				today, tmpDate,	currentCount, currentDate, datesToPrintArray, datesToPrintString;

			// Inputs
			firstName = utils.getNodeElements('id', 'firstName')[0];
			lastName = utils.getNodeElements('id', 'lastName')[0];
			favoriteFood = utils.getNodeElements('id', 'favoriteFood')[0];
			favoriteNumber = utils.getNodeElements('id', 'favoriteNumber')[0];
			favoriteDayOfWeek = utils.getNodeElements('id', 'favoriteDayOfWeek')[0];
			favoriteColor = utils.getNodeElements('id', 'favoriteColor')[0];

			// Messages Divs
			separatedSpaceInputDiv = utils.getNodeElements('class', 'space-separated-input')[0];
			reversedInputDiv = utils.getNodeElements('class', 'reversed-input')[0]; 
			asciiAdditionDiv = utils.getNodeElements('class', 'ascii-addition')[0];
			secondHighestFactorDiv = utils.getNodeElements('class', 'second-highest-factor')[0];
			nextOcurrencesDiv = utils.getNodeElements('class', 'next-ocurrences')[0]; 
			colorBoxDiv = utils.getNodeElements('class', 'color-selected')[0];
			
			// Load form into CodeTest obj
			codeTestObj.setForm(utils.getNodeElements('id', 'codeTest')[0]);

			// Don't allow inputs that aren't numbers when input[type="number"]
			utils.setListeners(document.querySelectorAll('input[type="number"]'), 'keypress', function(e) {
				if(e.which < 48 || e.which > 57) {
					e.preventDefault();
				}
			});

			// Event listeners
			utils.setListener(utils.getNodeElements('id', 'codeTestFormSubmit')[0], 'click', function(e) {
				codeTestObj.submit();
			});

			utils.setListener(firstName, 'input', function(e) {
				element = e.target;
				utils.elementCleanChildren(separatedSpaceInputDiv);
				separatedSpaceInputDiv.appendChild(document.createTextNode(element.value.split('').join(' ')));
			});

			utils.setListener(lastName, 'input', function(e) {
				element = e.target;
				utils.elementCleanChildren(reversedInputDiv);
				reversedInputDiv.appendChild(document.createTextNode(element.value.split('').reverse().join('')));
			});

			utils.setListener(favoriteFood, 'input', function(e) {
				element = e.target;
				asciiArray = convertToASCII(element.value);
				joinedArray = asciiArray.join(' + ');
				utils.elementCleanChildren(asciiAdditionDiv);
				asciiAdditionDiv.appendChild(document.createTextNode(joinedArray + ' = ' + addArray(asciiArray)));
			});

			utils.setListener(favoriteNumber, 'input', function(e) {
				element = e.target;
				secondHighestFactor = (typeof element.value === 'undefined' || element.value === '') ? '' : 
										getSecondHighestFactor(parseInt(element.value));
				utils.elementCleanChildren(secondHighestFactorDiv);
				secondHighestFactorDiv.appendChild(document.createTextNode(secondHighestFactor));
			});

			utils.setListener(favoriteDayOfWeek, 'change', function(e) {
				element = e.target;
				today = new Date();

				utils.elementCleanChildren(nextOcurrencesDiv);

				if(typeof element.value === 'undefined' || element.value === '') { return; }

				currentCount = 0;
				currentDate = new Date(today);
				while(currentDate.getDay() !== parseInt(element.value)) {
					currentCount++;
					currentDate = new Date(today);
					currentDate.setDate(today.getDate() + currentCount);
				}

				currentCount = 0;
				datesToPrintArray = [];
				tmpDate = new Date(currentDate);
				for(var i=0; i < 6; i++) {
					datesToPrintArray.push(getFormattedDate(tmpDate));
					currentCount += 7;
					tmpDate.setDate(currentDate.getDate() + currentCount);
				}

				datesToPrintString = datesToPrintArray.join(', ');

				nextOcurrencesDiv.appendChild(document.createTextNode(datesToPrintString));
			});

			utils.setListener(favoriteColor, 'change', function(e) {
				colorBoxDiv.className = 'print-area color-selected ' + e.target.value;
			});

		})();

		function getSecondHighestFactor(n) {
			var tmp = n -1;
			if(tmp < 1) { return ''; }
			while(n % tmp !== 0 && tmp > 0) {
				tmp--;
			}
			return tmp;
		}

		function convertToASCII(s) {
			return s.split("").map(function(item) {
				return item.charCodeAt(0);
			});
		}

		function addArray(l) {
			return l.reduce(function(previous, current) {
				return previous + current;
			});
		}

		function getFormattedDate(d) {
			return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
		}
	})();
});