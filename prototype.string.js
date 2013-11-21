if(!String.prototype.hasOwnProperty('endsWith')) {
	String.prototype.endsWith = function(value, stringComparison) {
		if(typeof(stringComparison) == 'undefined') {
			stringComparison = 1;
		}
		if(stringComparison == 2) {
			return this.length >= value.length && this.substr(this.length - value.length).toLowerCase() == value.toLowerCase();
		} else {
			return this.indexOf(value, this.length - value.length) !== -1;
		}
	};
}

if(!String.prototype.hasOwnProperty('startsWith')) {
	String.prototype.startsWith = function(value, stringComparison) {
		if(typeof(stringComparison) == 'undefined') {
			stringComparison = 1;
		}
		if(stringComparison == 2) {
			return this.length >= value.length && this.substr(0, value.length).toLowerCase() == value.toLowerCase();
		} else {
			return this.indexOf(value, 0) !== -1;
		}
	};
}

if(!String.prototype.hasOwnProperty('padLeft')) {
	// width for width of string OR characters to add
	// z = characher to padd with OR 0 if empty
	String.prototype.padLeft = function(width, z) {
		z = z || '0';
		n = this + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	};
}