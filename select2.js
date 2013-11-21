(function ( $ ) {
 
    $.fn.select2 = function( options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            color: "#556b2f",
            backgroundColor: "white"
        }, options );
 
        // Greenify the collection based on the settings variable.
        return this.each(function() {
					try { this.select(); } catch(err) {}
				});
 
    };
 
}( jQuery ));