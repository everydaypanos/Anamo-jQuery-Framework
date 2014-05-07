/**
  Verifies that a value is `null` or an empty string, empty array,
  or empty function.

  Constrains the rules on `Ember.isNone` by returning false for empty
  string and empty arrays.

  ```javascript
  jQuery.isEmpty();                // true
  jQuery.isEmpty(null);            // true
  jQuery.isEmpty(undefined);       // true
  jQuery.isEmpty('');              // true
  jQuery.isEmpty([]);              // true
  jQuery.isEmpty('Adam Hawkins');  // false
  jQuery.isEmpty([0,1,2]);         // false
  ```

  @method isEmpty
  @for Ember
  @param {Object} obj Value to test
  @return {Boolean}
	*/
(function ($) {
	$.isEmpty = function(obj) {
		return jQuery.isNone(obj) || (obj.length === 0 && typeof obj !== 'function') || jQuery.isEmptyObject(obj);
	};
})(jQuery);