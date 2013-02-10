//jQuery.extend({ 
//	postJSON: function(url, data, callback) {
//		return jQuery.post(url, data, callback, 'json');
//	}
//});
(function($) {
	
  // Document $.postJSON.
  $.postJSON = function(url, data, callback) {
		return jQuery.post(url, data, callback, 'json');
	};

}(jQuery));