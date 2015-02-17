/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery */

(function ($) {
	"use strict";
    var floppyCarousel = {
	
		init : function(settings) {
			floppyCarousel.config = {
				destinationImage : $(".image-container").eq(0)
			};
			$.extend(floppyCarousel.config, settings);
			//Setting up the effects
			floppyCarousel.setup();
		},
		setup : function () {
			console.log(this.getDestinationDimCord().height);
		},
		//Return and object containing the coordinate and dimensions of the destination
		getDestinationDimCord : function() {
			var dimCord = {};
			var offset = floppyCarousel.config.destinationImage.offset();
			var x = offset.left;
			var y = offset.top;
			var width = floppyCarousel.config.destinationImage.innerWidth();
			var height = floppyCarousel.config.destinationImage.innerHeight();
			dimCord.x = x;
			dimCord.y = y;
			dimCord.width = width;
			dimCord.height = height;
			return dimCord;
		}

	}
	$(document).ready(function(){
		floppyCarousel.init();
	});
}(jQuery));//End of musuem plugin global closure
