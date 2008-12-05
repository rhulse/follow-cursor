/*
 	jQuery Squidy plugin

	This plugin sets up an image to follow the mouse around the page.

	The effect is based on the mouse squidie effect by Roy Whittle as published on http://www.javascript-fx.com/

	Copyright (c) 2008 Richard Hulse
	This software is released under the GNU GPL version 2 or later. <http://www.opensource.org/licenses/gpl-2.0.php>

*/

(function($) {

  $.squidy = function(options) {

	  $().mousemove(function(e){
	     $('#status').html(e.pageX +', '+ e.pageY);
	  });
	}

})(jQuery);