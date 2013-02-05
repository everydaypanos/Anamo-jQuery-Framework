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
			}
			return this;
		}
	};//$.mvc
	
	$.mvc1 = function() {
		this.version = '1.2.0';
		var parent = this;
		//this.parent = this;// = Object.freeze({'nt': this}); PRIVATE
		
		
		/**
			app.layout
			contains selector shortcuts for basic layout elements
			
			example:
			<html>
				<body>
					<div.container>
						<header.main-header>
						<div#content>
							<div.layout--subnav-main-related(per page custom theme)
								<nav#content-subnav>
								<section#main-content>
									<div.blabla>
									<form|article|div.form-content.article-content.base-content>
									<div#edit-pane-view>
						<footer.main-footer>
		*/
		this.layout = new function() {
			this.contentContainer = '#content'; // main transitioning area
			this.contentSubnav = '#content-subnav'; // sidebar for navigation
			this.mainContent = '#main-content'; // next to sidebar area
			this.formContent = '.form-content'; // a form
			this.articleContent = '.article-content'; // an article
			this.baseContent = '.base-content'; // an unknown/custom area
			this.editPane = '#edit-pane-view'; // an edit pane for a main page
		};//this.layout
		
		
		/**
			app.navigation
			a base class for transitioning between pages, submiting and validating forms and other core functionality
			
			example:
			app.nav.domParser = function() {
				app.nav.$domData.find('x\\:select').each(function() {
					$(this).replaceWith('');
				});
				
				app.nav.$domData.find('form label').each(function() {
					// Add title attr to all labels
					if(typeof($(this).attr('title')) == 'undefined') {
						$(this).attr('title', $(this).text());
					}
				});
			};
			
			$(window).on('hashchange', function(e) {
				// Save previous page uri for later use
				var prevUri = App.Nav.currentPage();
				
				// Run a page changed event (overwrites App.Nav.currentPage)
				App.Nav.prepare();console.log(App.Nav.currentPage());
				
				// Clear page events
				$(document).off('.pageEvents');
				
				// Preselect navigation classes.
				$('.main-nav .current-nav-item').removeClass('current-nav-item');
				if(App.Nav.currentPage() != null) {
					$('.main-nav a[href="#!'+App.Nav.currentPage()+'"]:first').addClass('current-nav-item');
				}
				
				// App.Nav.currentPage now must be set to smt. It can be null if hash is [empty OR malformed]
				if(App.Nav.currentPage() == null) {
					window.location.hash = (window.location.hash.length == 0? '#!/home': '#!/error');
					return; // EDIT POINT 1
				}
				
				// If navigation is on another page, fetch view + template. Else just load controller
				if(prevUri != App.Nav.currentPage()) {
					
					// Start loading timer
					//$(App.Layout.contentContainer).empty().append('<div class="layout--main">  <section class="main-content">    <div class="loading-indicator"><i></i></div>  </section></div>');
					//return;
					
					// Get script of new page
					var scriptIsFoundOrNot = function() {
						App.Nav.viewIsLoaded = true;
						
						if(App.Nav.templateIsLoaded) {
							App.Nav.pageReady();
						}
					};
					App.viewXhr = $.getScript(App.Settings.viewsUri+'?p='+App.Nav.currentPage()).done(function(script, textStatus) {
						scriptIsFoundOrNot();console.log('view found!');
					})
					// Views are optional. On fail, go on.
					.fail(function(jqxhr, settings, exception) {
						scriptIsFoundOrNot();
					});
					
					// Get template of new page
					App.templateXhr = $.get(App.Settings.templatesUri+'?p='+App.Nav.currentPage(), function(data) {
						// Successful AJAX req.
						App.Nav.templateIsLoaded = true;console.log('template found!');
						
						App.Nav.DOMData = data;
						
						if(App.Nav.viewIsLoaded) {
							App.Nav.pageReady();
						}
					})
					// If error is 404 then go to error page
					.error(function(jqXHR, textStatus, errorThrown) {
						if(parseInt(jqXHR.status) == 404) {
							window.location.hash = '#!/error';
							return;
						}
					});
				}
				
				// Get controller of new page
				App.controllerXhr = $.postJSON(App.Settings.apiBaseUri+App.Nav.currentPage()+'.load', $.param(App.Nav.uri.params), function(data) {
					App.Nav.controllerIsLoaded = true;console.log('controller found!');
					
					App.Nav.loadData = data;
					
					if(App.Nav.viewIsLoaded && App.Nav.templateIsLoaded) {
						App.Nav.pageLoad();
					}
				});//.error(function(jqXHR, textStatus, errorThrown) {alert(textStatus+errorThrown);});//.success(function() { alert("second success"); })//.complete(function() {console.log('controller completed!'); });
				
			});//$(window).on('hashchange)
		*/
		this.nav = new function() {
			this.viewXhr = null;
			this.templateXhr = null;
			this.controllerXhr = null;
			this.viewIsLoaded = function() {
				return (typeof(this.viewXhr) != 'undefined' && this.viewXhr != null);
			};
			this.templateIsLoaded = function() {
				return (typeof(this.templateXhr) != 'undefined' && this.templateXhr != null);
			};
			this.controllerIsLoaded = function() {
				return (typeof(this.controllerXhr) != 'undefined' && this.controllerXhr != null);
			};
			this.editPanes = {}; // /users/[0-9]/edit: /users
			this.uriIsEditPane = function(uri) {
				for(var Key in this.editPanes) {
					var matches = uri.match(new RegExp(Key, 'i'));
					if(matches != null) {
						return this.editPanes[Key];
					}
				}
				return uri;
			};
			
			this.uri = null;
			// Shorthand for uri.path. NULL if uri has problems or empty
			this.currentPage = function() {
				return (this.uri == null? null: (this.uri.source == null? null: this.uriIsEditPane(this.uri.path)));
			};
			
			this.$domData = null;
			this.domParser = null;
			
			this.loadData = null;
			
			// This is called immediately after hashchange or pageload event. It resets+updates vars(currentpage)
			this.prepare = function() {
				// Abort view, template, controller XHRs
				if(this.viewIsLoaded()) {
					this.viewXhr.abort();
				}
				if(this.templateIsLoaded()) {
					this.templateXhr.abort();
				}
				if(this.controllerIsLoaded()) {
					this.controllerXhr.abort();
				}
				
				// Update uri
				this.uri = new $.hash();
				
				// Reset all others
				this.viewXhr = null;
				this.templateXhr = null;
				this.controllerXhr = null;
				
				this.$domData = null;
				this.loadData = null;
				
				// Clear page events
				$(document).off('.pageEvents');
			};//this.prepare
			
			// This is called when View AND/OR Template are ready
			this.pageReady = function() {
				// Empty DOM
				$(parent.layout.contentContainer).empty();
				
				// Parse
				if(typeof(this.$domData) != 'undefined' && typeof(this.domParser) != 'undefined') {
					this.domParser(this.$domData);
				}
				
				// Update DOM
				if(typeof(this.$domData) != 'undefined') {
					$(parent.layout.contentContainer).append(this.$domData);console.log('DOM Updated!');
				}
				
				// Clear memory
				this.$domData = null;
				
				// Trigger ready event for page. This comes ONLY on pageReday
				$(document).trigger('ready.pageEvents');
				
				// If controller is weirdly already loaded, then trigger a pageLoad
				//if(this.controllerIsLoaded()) {
					//this.pageLoad();
				//}
			};//this.pageReady
			
			// This is called when editpane is ready to show
			this.editPaneReady = function() {
				// Empty DOM
				$(parent.layout.contentContainer).empty();
				
				// check subpage
				if(this.uriIsEditPane(this.uri.path) != this.uri.path) {
					$(this.editPane).show();
				} else {
					$(this.editPane).hide();
				}
				
				// Trigger ready event for page. This comes ONLY on pageReday
				$(document).trigger('ready2.pageEvents');
			};//this.editPaneReady
			
			// This is called every time a controller is loaded
			this.pageLoad = function() {
				// Trigger load event for page. This comes ONLY on pageLoad.
				$(document).trigger('load.pageEvents', [this.loadData]);
				this.loadData = null;
			};
			
		};//App.Navigation
		
	};//$.mvc1
})(jQuery);