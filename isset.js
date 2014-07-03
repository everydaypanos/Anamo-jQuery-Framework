/**
  Opposite of isNone.

  ```javascript
  jQuery.isset();              // false
  jQuery.isset(null);          // false
  jQuery.isset(undefined);     // false
  jQuery.isset('');            // true
  jQuery.isset([]);            // true
  jQuery.isset(function() {});  // true
  ```

  @method isNone
  @for isset
  @param {Object} obj Value to test
  @return {Boolean}
	*/
(function($) {
	$.isset = function(obj) {
		return !jQuery.isNone(obj);
	};
})(jQuery);