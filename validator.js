document.addEventListener('DOMContentLoaded', function() {
	window.validator = (function() {
		function Validation(config) {
			if(typeof config.name === 'undefined') { throw new Error('Validation must have a type.'); }

			this.name = config.name;
			this.elements = config.elements || [];
			this.condition = config.condition || function() { return true; };
			this.action = config.action || utils.noop;
			this.errorMessage = config.errorMessage || '';
			this.includesAttrValue = config.includesAttrValue || false;
		}

		Validation.isType = function(data) {
			var type = data.attrValue;
			switch(type){	
			case 'number':
				return utils.isNumber(data.val);
				break;
			default:
				return typeof data.val === type;
			}
		};

		Validation.notEmpty = function(data) {
			return typeof data.val !== 'undefined' && data.val.trim() !== '';
		};

		Validation.prototype.setAction = function(action) {
			this.action = action;
		};

		// Initialise validations and currently supported validation types
		var validations = {
			notEmpty: new Validation({ 
				name: 'not-empty',
				condition: Validation.notEmpty,
				errorMessage: 'Field must not be empty. '
			}),
			isType: new Validation({
				name: 'type',
				condition: Validation.isType,
				includesAttrValue: true,
				errorMessage: 'Field must be of type '
			})
		};

		// Set actions for validations, get validation elements and set up listeners
		(function() {
			for(k in validations) {
				validations[k].setAction(actionCreator.bind(validations[k])());
				validations[k].elements = utils.getNodeElements('attr', 'data-validator-' + validations[k].name);
				utils.setListeners(validations[k].elements, 'input', validations[k].action);
			}
		})();

		function actionCreator() {
			var self = this;

			return function(e) {
				var element = e.target;
				var parentNode = element.parentNode;
				var errorMessage = self.errorMessage || 'Invalid input.';
				var errorMessageArea;
				var dataForValidation = {};
				dataForValidation.val = element.value;
				if(self.includesAttrValue) {
					dataForValidation.attrValue = element.getAttribute('data-validator-' + self.name);
					errorMessage += dataForValidation.attrValue + '. ';
				}
				if(!self.condition(dataForValidation) && !utils.elementHasClass(parentNode, self.name + '-message')) {
					utils.elementAddClass(element, 'hasInvalidValue');
					errorMessageArea = utils.createNodeWithText('span', errorMessage);
					utils.elementSetAttr(errorMessageArea, 'class', self.name + '-validation');
					parentNode.appendChild(errorMessageArea);
					utils.elementAddClass(parentNode, self.name + '-message');
				} else {
					utils.elementRemoveClass(element, 'hasInvalidValue');
					utils.elementRemoveClass(parentNode, self.name + '-message');
					errorMessageArea = utils.getChildrenFrom(parentNode, 'class', self.name + '-validation');
					if(errorMessageArea.length) {
						parentNode.removeChild(errorMessageArea[0]);
					}
				}
			};
		}

		// Tests if given form is valid
		function isValidForm(formId) {
			var form = utils.getNodeElements('id', formId)[0];
			var formElementsByValidation = {};
			var tmpData = {};

			for(k in validations) {
				formElementsByValidation[k] = utils.getNodeElements('attr', 'data-validator-' + validations[k].name, form);
			}

			for(k in formElementsByValidation) {
				for(var i=0, len=formElementsByValidation[k].length; i < len; i++) {
					tmpData.val = formElementsByValidation[k][i].value;
					if(validations[k].includesAttrValue) {
						tmpData.attrValue = formElementsByValidation[k][i].getAttribute('data-validator-' + validations[k].name);
					}
					if(!validations[k].condition(tmpData)) {
						return false;
					}
				}
			}

			return true;
		}

		var validator = {
			isValidForm: isValidForm
		};

		return validator;
	})();
});