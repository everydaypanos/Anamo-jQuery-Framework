/**
  Returns true if the passed value is null or undefined. This avoids errors
  from JSLint complaining about use of ==, which can be technically
  confusing.

  ```javascript
  jQuery.isNone();              // true
  jQuery.isNone(null);          // true
  jQuery.isNone(undefined);     // true
  jQuery.isNone('');            // false
  jQuery.isNone([]);            // false
  jQuery.isNone(function() {});  // false
  ```

  @method isNone
  @for Ember
  @param {Object} obj Value to test
  @return {Boolean}
	*/
(function($) {
	$.isNone = function(obj) {
		return typeof obj == 'undefined' || obj === null;
	};
})(jQuery);