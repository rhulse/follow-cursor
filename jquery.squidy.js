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
			mouse_y = 0;

  $.squidy = function(options) {

		var opts = $.extend({}, $.squidy.defaults, options);

	  $().mousemove(function(e){
			mouse_x = e.pageX;
			mouse_y = e.pageY;
	  });

    $.periodic( run_aminations, {frequency: opts.animation_interval} );
	}

	function run_aminations(){
		$('#status').html( mouse_x + ', ' + mouse_y );
		return true;
	}

  $.squidy.defaults = {
		animation_interval	: 0.04
  };

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



