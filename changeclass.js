/*!
 * jQuery MVC - Base functionality for an MVC app
 * Copyright(c) 2013 Panos Tsimpoglou <everydaypanos@anamo.eu>
 * MIT Licensed.
 *
 * http://static.anamo.eu/3/ajq.js
 */
 (function ($) {
	$.changeClass = function(what, condition) {
			
			if(condition) {
				return this.addClass(what);
			} else {
				return this.removeClass(what);
			}
			
	};
})(jQuery);