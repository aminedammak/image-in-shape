/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery */

(function ($) {
	"use strict";
    var floppyCarousel = {
	
		init : function (settings) {
			floppyCarousel.config = {
				destinationImage : ".image-container",
				thumbnails : $(".thumbnail-container img")
			};
			$.extend(floppyCarousel.config, settings);
			//Setting up the effects
			floppyCarousel.setup();
		},
		getDestinationImage : function () {
			return $(floppyCarousel.config.destinationImage).eq(0);
		},
		getThumbnails : function () {
			return $(floppyCarousel.config.thumbnails);
		},
		clickedTumbnail : {},
		setup : function () {
			floppyCarousel.beginEffect();
		},
		//Return and object containing the coordinate and dimensions of the destination
		getDimCord : function ($element) {
			var dimCord = {};
			var offset = $($element).offset();
			var x = offset.left;
			var y = offset.top;
			var width = $($element).innerWidth();
			var height = $($element).innerHeight();
			dimCord.x = x;
			dimCord.y = y;
			dimCord.width = width;
			dimCord.height = height;
			return dimCord;
		},
		xProgress : 0,
		yProgress : 0,
		getXYStep : function () {
			var verticalDistance = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).y -  floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y;
			var horizontalDistance = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).x -  floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).x;
			
			var yRatio = Math.abs(verticalDistance) / Math.abs(horizontalDistance);
			if (verticalDistance < 0) {
				floppyCarousel.yProgress -= yRatio;
			} else if (verticalDistance > 0) {
				floppyCarousel.yProgress += yRatio;
			}
			
			if (horizontalDistance < 0) {
				floppyCarousel.xProgress -= 1;
			} else if (horizontalDistance > 0) {
				floppyCarousel.xProgress += 1;
			}
			return { xProgress : floppyCarousel.xProgress, yProgress : floppyCarousel.yProgress };
		},
		
		animateImage : function (startTime) {
			// update
			var time = floppyCarousel.getActualTime() - startTime;

			var linearSpeed = 390;
			// pixels / second
			var newX = linearSpeed * time / 1000;

			// clear
			floppyCarousel.canvasObj.context.clearRect(0, 0, floppyCarousel.canvasObj.canvas[0].width, floppyCarousel.canvasObj.canvas[0].height);

			floppyCarousel.canvasObj.context.drawImage(
				floppyCarousel.canvasObj.imageObj,
				0,
				0,
				floppyCarousel.canvasObj.imageObj.width,
				floppyCarousel.canvasObj.imageObj.height,
				floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).x + floppyCarousel.getXYStep().xProgress,
				floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y + floppyCarousel.getXYStep().yProgress,
				floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).width,
				floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).height
			);
			// request new frame
			window.requestAnimFrame(function () {
				floppyCarousel.animateImage(startTime);
				console.log(floppyCarousel.getXYStep().yProgress);
			});
		
		},
		beginEffect : function () {
			var that = this;
			floppyCarousel.getThumbnails().click(function (e) {
				floppyCarousel.createIntermediateCanvas($(this));
				var startTime = floppyCarousel.getActualTime();
				floppyCarousel.clickedTumbnail = $(this);
				floppyCarousel.animateImage(startTime);
			});
		},
		canvasObj : {},
		createIntermediateCanvas : function (sourceThumbnail) {
			floppyCarousel.canvasObj.canvas = $('<canvas id="floppyCanvas" height="1000" width="1000"></canvas>');
			floppyCarousel.canvasObj.canvas.appendTo("body");
			floppyCarousel.canvasObj.context = floppyCarousel.canvasObj.canvas[0].getContext("2d");
			floppyCarousel.canvasObj.imageObj = new Image();
			floppyCarousel.canvasObj.imageObj.src = $(sourceThumbnail).attr('src');
		},
		getActualTime : function () {
			return (new Date()).getTime();
		}
		
	};
	$(document).ready(function () {
		floppyCarousel.init();
	});
	
	window.requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	}());
}(jQuery));//End of musuem plugin global closure
