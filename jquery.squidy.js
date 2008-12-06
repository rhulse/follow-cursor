/*
 	jQuery Squidy plugin

	This plugin sets up an image to follow the mouse around the page.

	The effect is based on the mouse squidie effect by Roy Whittle as published on http://www.javascript-fx.com/

	Copyright (c) 2008 Richard Hulse
	This software is released under the GNU GPL version 2 or later. <http://www.opensource.org/licenses/gpl-2.0.php>

*/

(function($) {

	// for tracking the current position of the mouse
	var mouse_x = 0,
			mouse_y = 0,
			mouse_tracking = false;


  $.squidy = function(options) {

		var defaults = {
			tail_length 				: 15,
			animation_interval	: 0.05,
			head_img						: '',
			tail_img						: ''
		}

		opts = $.extend({}, defaults, options);

		squid = new squidy(opts, 1.0 );

		$.periodic( function(){squid.animate(); return true;}, {frequency: opts.animation_interval} );

		if( ! mouse_tracking ){
			start_mouse_tracking();
		}
	}

	function start_mouse_tracking(){
		$().mousemove(function(e){
			mouse_x = e.pageX;
			mouse_y = e.pageY;
		});
	}

	function create_layer( img_src, x, y, zindex, opacity){
		$('body').append('<img class="segment-' + zindex + '" />');
		img = $('img.segment-' + zindex );
		img.attr({ src: img_src, class: 'zindex' + zindex })
					.css({
						opacity	: opacity,
						position: 'absolute',
						top 		: x,
					  left		: y,
						zIndex	: zindex
					});
		return img;
	}

	function squidy( opts, head_img, tail_img, opacity ){
		this.followers = new Array();
		this.followers[0] = create_layer( opts.head_img, -200, 200, opts.tail_length, opacity );

		for( i=1 ; i<opts.tail_length ; i++){
			this.followers[i] = create_layer( opts.tail_img, -200, 200, opts.tail_length-i, opacity );
		}

		this.targetX	= 200;
		this.targetY	= 200;
		this.x		= -100;
		this.y		= -100;
		this.dx		= 0;
		this.dy		= 0;

		this.animate = function(){
			var m, offset;
			for( i=this.followers.length-1 ; i>0 ; i-- ){
				// get the position of the next layer
				offset = this.followers[i-1].offset();
				offset.left += 0;
				offset.top -= 2;
				this.followers[i].css(offset);
			}
			m = this.followers[0];
			offset = m.offset();
			var X = (this.targetX - offset.left);
			var Y = (this.targetY - offset.top);
			var len = Math.sqrt(X*X+Y*Y) || 2;
			var dx = 20 * (X/len);
			var dy = 20 * (Y/len);
			var ddx = (dx - this.dx)/10;
			var ddy = (dy - this.dy)/10;
			this.dx += ddx;
			this.dy += ddy;
			offset.left += this.dx;
			offset.top += this.dy;

			m.css( offset );
			this.targetX = mouse_x - (m.width()  / 2) ;
			this.targetY = mouse_y - (m.height() - 5);
		}
	}


})(jQuery);

/*
 * jquery-periodic.js
 *
 * Adds a "periodic" function to jQuery which takes a callback and options for the frequency (in seconds) and a
 * boolean for allowing parallel execution of the callback function (shielded from exceptions by a try..finally block.
 * The first parameter passed to the callback is a controller object.
 *
 * Return falsy value from the callback function to end the periodic execution.
 *
 * For a callback which initiates an asynchronous process:
 * There is a boolean in the controller object which will prevent the callback from executing while it is "true".
 *   Be sure to reset this boolean to false when your asynchronous process is complete, or the periodic execution
 *   won't continue.
 *
 * To stop the periodic execution, you can also call the "stop" method
of the controller object, instead of returning
 * false from the callback function.
 *
 */
 jQuery.periodic = function (callback, options) {
      callback = callback || (function() { return false; });

      options = jQuery.extend({ },
                              { frequency : 10,
                                allowParallelExecution : false},
                              options);

      var currentlyExecuting = false;
      var timer;

      var controller = {
         stop : function () {
           if (timer) {
             window.clearInterval(timer);
             timer = null;
           }
         },
         currentlyExecuting : false,
         currentlyExecutingAsync : false
      };

      timer = window.setInterval(function() {
         if (options.allowParallelExecution || !(controller.currentlyExecuting || controller.currentlyExecutingAsync)){
            try {
                 controller.currentlyExecuting = true;
                 if (!(callback(controller))) {
                     controller.stop();
                 }
             } finally {
              controller.currentlyExecuting = false;
            }
         }
      }, options.frequency * 1000);
};



