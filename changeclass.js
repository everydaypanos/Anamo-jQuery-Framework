/*!
 * jQuery MVC - Base functionality for an MVC app
 * Copyright(c) 2013 Panos Tsimpoglou <everydaypanos@anamo.eu>
 * MIT Licensed.
 *
 * http://static.anamo.eu/3/ajq.js
 */
(function ( $ ) {
 
    $.fn.changeClass = function( className, author, options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            //color: "#556b2f",
            //backgroundColor: "white"
        }, options );
 
        // Greenify the collection based on the settings variable.
				if($.isset(author) && author === true) {
					return this.addClass(className);
				} else {
					return this.removeClass(className);
				}
 
    };
 
}( jQuery ));