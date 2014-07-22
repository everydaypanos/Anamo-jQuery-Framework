/**
	Usage
	$.cachedScript( "ajax/test.js" ).done(function( script, textStatus ) {
		console.log( textStatus );
	});
	*/
(function($) {
  $.cachedScript = function(url, options) {
		// Allow user to set any option except for dataType, cache, and url
		options = $.extend( options || {}, {
			dataType: 'script',
			cache: true,
			url: url
		});
	 
		// Use $.ajax() since it is more flexible than $.getScript
		// Return the jqXHR object so we can chain callbacks
		return jQuery.ajax( options );
	};
}(jQuery));