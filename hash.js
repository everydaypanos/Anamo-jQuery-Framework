/*!
 * jQuery MVC - Base functionality for an MVC app
 * Copyright(c) 2013 Panos Tsimpoglou <everydaypanos@anamo.eu>
 * MIT Licensed.
 *
 * http://static.anamo.eu/3/ajq.js
 *
 * Example
 * var hasher = new $.hash();
 * console.log(hasher.source);
 * RETURN null if errors, entore hash if success
 */
(function($) {
	$.hash = function(customHash, options) {
		var defaults = {  
			hashbang: '#!/'
		};
		var options = $.extend(defaults, options || {});
	
		this.source = null;
		this.path = '';
		this.file = '';
		this.params = [];
		
		/**
			parse hash
		*/
		this.tryParse = function(hash) {
			try {
				var preHash = $.trim(hash.toString());
				
				if(preHash.length == 0) {
					throw new Error();
				}
				
				if(preHash.indexOf(options.hashbang) == -1) {
					throw new Error();
				}
				
				preHash = preHash.substring(options.hashbang.length);
				
				var indexOfQuestonMark = preHash.indexOf('?');
				if(indexOfQuestonMark > -1) {
					this.path = preHash.substring(0, indexOfQuestonMark).replace(/^([^\/])/, '/$1');
					
					if(preHash.length > indexOfQuestonMark + 1) {
						this.params = $.deparam(preHash.substring(indexOfQuestonMark + 1));
					}
				} else {
					this.path = preHash.replace(/^([^\/])/, '/$1');
				}
				this.file = (this.path.match(/\/([^\/?#]+)$/i) || [, ''])[1];
				
				return preHash;
			} catch(ex) {
				return null;
			}
		};
		
		this.source = this.tryParse(typeof(customHash) != 'undefined'? customHash: window.location.hash);
		
		// This function creates a new anchor element and uses location
		// properties (inherent) to get the desired URL data. Some String
		// operations are used (to normalize results across browsers).
		//function parseURL(url) {
	//		var a =  document.createElement('a');
	//		a.href = url;
	//		return {
	//				source: url,
	//				protocol: a.protocol.replace(':',''),
	//				host: a.hostname,
	//				port: a.port,
	//				query: a.search,
	//				params: (function(){
	//						var ret = {},
	//								seg = a.search.replace(/^\?/,'').split('&'),
	//								len = seg.length, i = 0, s;
	//						for (;i<len;i++) {
	//								if (!seg[i]) { continue; }
	//								s = seg[i].split('=');
	//								ret[s[0]] = s[1];
	//						}
	//						return ret;
	//				})(),
	//				file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
	//				hash: a.hash.replace('#',''),
	//				path: a.pathname.replace(/^([^\/])/,'/$1'),
	//				relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
	//				segments: a.pathname.replace(/^\//,'').split('/')
	//		};
	//	}
		
	};
})(jQuery);