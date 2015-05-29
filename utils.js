document.addEventListener('DOMContentLoaded', function() {
	window.utils = (function() {
		var utils = {
			// DOM
			getNodeElements: function(by, s, element) {
				if(typeof by === 'undefined') { throw new Error('by argument is required.'); }
				if(typeof s === 'undefined') { throw new Error('s argument is required.'); }

				if(typeof s !== 'string') { throw new Error('Selector value s must be a string.'); }

				element = element || document;

				switch(by) {
				case 'name':
					return element.getElementsByName(s);
					break;
				case 'tag':
					return element.getElementsByTagName(s);
					break;
				case 'class':
					return element.getElementsByClassName(s);
					break;
				case 'id':
					return [element.getElementById(s)];
				case 'attr':
					return element.querySelectorAll('[' + s + ']'); // Works only in modern browsers. >=IE8
					break;
				default:
					throw new Error('Invalid type of selector ' + by);
				}
			},
			getChildrenFrom: function(element, by, s) {
				return this.getNodeElements(by, s, element);
			},
			setListener: function(element, ev, func) {
				element.addEventListener(ev, func);
			},
			setListeners: function(elements, ev, func) {
				for(var i=0, len=elements.length; i < len; i++) {
					this.setListener(elements[i], ev, func);
				}
			},
			createNodeWithText: function(tag, text) {
				var node = document.createElement(tag);
				var textNode = document.createTextNode(text);
				node.appendChild(textNode);

				return node;
			},
			elementHasClass: function(element, className) {
				return element.className && new RegExp("(\\s|^)" + className + "(\\s|$)").test(element.className);
			},
			elementRemoveClass: function(element, className) {
				var classToRemove = new RegExp('\\b' + className + '\\b', 'i');
				element.className = element.className.replace(classToRemove, '');
			},
			elementSetAttr: function(element, attr, val) {
				element.setAttribute(attr, val);
			},
			elementAddClass: function(element, className) {
				element.className = element.className + ' ' + className;
			},
			elementCleanChildren: function(element) {
				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}
			},

			// General
			noop: function() {},
			isNumber: function(s) {
				return !isNaN(parseFloat(s));
			}
		};

		return utils;
	})();
});