/*!
 * jQuery MVC - Base functionality for an MVC app
 * Copyright(c) 2013 Panos Tsimpoglou <everydaypanos@anamo.eu>
 * MIT Licensed.
 *
 * http://static.anamo.eu/3/ajq.js
 */
(function($) {
	$.mvc = {
		create: function(version) {
			if(version == 1) {
				$.extend(this, new $.mvc1());
			} else if(version == 2) {
				$.extend(this, new $.mvc2());
			}
			return this;
		}//create
	};//$.mvc
	
	// https://sites.google.com/a/anamo.eu/adn/projects/anamo-jquery-framework/mvc/ver
	$.mvc2 = function() {
		this.version = '2.0';
		
		var parent = this;
		
		this.layout = new function() {
			this.contentContainer = '#content';
			this.contentSubnav = '#content-subnav';
			this.mainContent = '#main-content';
			this.formContent = '.form-content';
			this.articleContent = '.article-content';
			this.baseContent = '.base-content';
			this.editPane = '#edit-pane-view';
		};//this.layout
		
		
		this.nav = new function() {
			this.settings = {
				'isDebugMode': true,
				'scriptName': '',
				'apiBaseUri': '',
				'viewsUri': '',
				'templatesUri': '',
				'domParser': function() {},
				'subStates': {}
			};
			
			this.viewXhr = null;
			this.templateXhr = null;
			this.controllerXhr = null;
			this.controller2Xhr = null;
			
			this.uri = null;
			
			this.$domData = null;
			this.loadData = null;
			
			this.stateChange = function(newState, params) {
				// Abort view, template, controller XHRs
				if($.isset(this.viewXhr)) {
					this.viewXhr.abort();
				}
				if($.isset(this.templateXhr)) {
					this.templateXhr.abort();
				}
				if($.isset(this.controllerXhr)) {
					this.controllerXhr.abort();
				}
				if($.isset(this.controller2Xhr)) {
					this.controller2Xhr.abort();
				}
				
				// Reset all others
				this.viewXhr = null;
				this.templateXhr = null;
				this.controllerXhr = null;
				this.controller2Xhr = null;
				
				this.$domData = null;
				this.loadData = null;
				
				// Clear page events
				$(document).off('.pageEvents');
				
				// This is called when View AND/OR Template are ready
				pageReady = function() {
					// Empty DOM
					$(parent.layout.contentContainer).empty();
					
					// Update DOM
					if($.isset(parent.nav.$domData)) {
						$(parent.layout.contentContainer).append(parent.nav.$domData);
						
						if(parent.nav.settings.isDebugMode) {
							console.log('DOM Updated!');
						}
					}
					
					// Clear memory
					parent.nav.$domData = null;
					
					// Trigger ready event for page. This comes ONLY on pageReday
					$(document).trigger('mvc-ready').trigger('ready.pageEvents');
					
					// If controller is weirdly already loaded, then trigger a pageLoad
					if(!$.isset(parent.nav.controllerXhr)) {
						pageLoad();
					}
				};//pageReady
				
				// This is called every time a controller is loaded
				pageLoad = function() {
					// Trigger load event for page. This comes ONLY on pageLoad.
					$(document).trigger('mvc-load').trigger('load.pageEvents', [parent.nav.loadData]);
					
					parent.nav.loadData = null;
				};//pageLoad
				
				// Fetch view
				this.viewXhr = $.ajax({
					url: this.settings.viewsUri+'?q='+newState,
					dataType: 'script',
					success: function(data, textStatus, jqXHR) {
						if(parent.nav.settings.isDebugMode) {
							console.log('view found!');
						}
					},
					complete: function(jqXHR, textStatus) {
						parent.nav.viewXhr = null;
						
						// Complete Step 1
						if(!$.isset(parent.nav.templateXhr)) {
							pageReady();
						}
					}
				});//this.viewXhr
				
				// Don't wait, fetch template of new page
				this.templateXhr = $.get(this.settings.templatesUri+'?q='+newState, function(data) {
					// Successful AJAX req.
					parent.nav.$domData = $(data);
					
					if(parent.nav.settings.isDebugMode) {
						console.log('template found!');
					}
					
					// Parse
					if($.isset(parent.nav.settings.domParser)) {
						parent.nav.settings.domParser();
					}
					
					// Complete Step 1
					if(!$.isset(parent.nav.viewXhr)) {
						pageReady();
					}
				})
				.always(function() {
					parent.nav.templateXhr = null;
				});//this.templateXhr
				
				// Don't wait, fetch controller of new page
				this.controllerXhr = $.postJSON(this.settings.apiBaseUri+newState+'.load', params, function(data) {
					parent.nav.loadData = data;
					
					if(parent.nav.settings.isDebugMode) {
						console.log('controller found!');
					}
					if(!$.isset(parent.nav.viewXhr) && !$.isset(parent.nav.templateXhr)) {
						pageLoad();
					}
				})
				.always(function() {
					parent.nav.controllerXhr = null;
				});//this.controllerXhr
				
			};//this.stateChange
			
			
			this.subStateChange = function(newState, params) {
				if($.isset(this.controller2Xhr)) {
					this.controller2Xhr.abort();
				}
				this.controller2Xhr = null;
				
				// Fetch controller of edit pane
				this.controller2Xhr = $.postJSON(this.settings.apiBaseUri+newState+'.load', params, function(data) {
					if(parent.nav.settings.isDebugMode) {
						console.log('controller found! (2)');
					}
			
					// Trigger load event for page. This comes ONLY on pageLoad.
					$(document).trigger('mvc-load2').trigger('load2.pageEvents', data);
				})
				.always(function() {
					parent.nav.controller2Xhr = null;
				});//this.controller2Xhr
			};//this.subStateChange
			
		};//this.nav
		
		Object.freeze(parent);
		
	};//$.mvc2
})(jQuery);