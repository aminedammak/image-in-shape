/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery */

(function ($) {
	"use strict";
    var floppyCarousel = {
	
		init : function (settings) {
			floppyCarousel.config = {
				destinationImage : ".image-container",
				thumbnails : $(".thumbnail-container img"),
				speed : 2
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
		wProgress : 0,
		hProgress : 0,
		getXYStep : function () {
			var verticalDistance = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).y -  floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y;
			var horizontalDistance = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).x -  floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).x;
			var widthDifference = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).width - floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).width;
			var heightDifference = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).height - floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).height;
			var xRatio = Math.abs(horizontalDistance) / Math.abs(verticalDistance) * floppyCarousel.config.speed;
			var widthRadio = Math.abs(widthDifference) / Math.abs(verticalDistance) * floppyCarousel.config.speed;
			var heightRadio = Math.abs(heightDifference) / Math.abs(verticalDistance) * floppyCarousel.config.speed;
			if (verticalDistance < 0) {
				floppyCarousel.yProgress -= floppyCarousel.config.speed;
			} else if (verticalDistance > 0) {
				floppyCarousel.yProgress += floppyCarousel.config.speed;
			}
			if (horizontalDistance < 0) {
				floppyCarousel.xProgress -= xRatio;
			} else if (horizontalDistance > 0) {
				floppyCarousel.xProgress += xRatio;
			}
			floppyCarousel.wProgress += widthRadio;
			floppyCarousel.hProgress += heightRadio;
			
			return { xProgress : floppyCarousel.xProgress, yProgress : floppyCarousel.yProgress, wProgress : floppyCarousel.wProgress, hProgress : floppyCarousel.hProgress };
		},
		animateImage : function (startTime) {
			floppyCarousel.clearCanvas();
			floppyCarousel.canvasObj.context.drawImage(
				floppyCarousel.canvasObj.imageObj,
				0,
				0,
				floppyCarousel.canvasObj.imageObj.width,
				floppyCarousel.canvasObj.imageObj.height,
				floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).x + floppyCarousel.getXYStep().xProgress,
				floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y + floppyCarousel.getXYStep().yProgress,
				floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).width + floppyCarousel.getXYStep().wProgress,
				floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).height + floppyCarousel.getXYStep().hProgress
			);
		
			console.log(floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).width + floppyCarousel.getXYStep().wProgress);
			
			// request new frame
			window.requestAnimFrame(function () {
				var diff = (floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).y) - (floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y);
				
				//if the animated image rich the top left corner of the destination image
				if (Math.abs(floppyCarousel.getXYStep().yProgress) >= Math.abs(diff)) {
					floppyCarousel.deleteIntermediateCanvas();
					//Reset progress
					floppyCarousel.yProgress = 0;
					floppyCarousel.xProgress = 0;
					floppyCarousel.wProgress = 0;
					floppyCarousel.hProgress = 0;
				} else {
					//continue animation
					floppyCarousel.animateImage(startTime);
				}
			});
		},
		beginEffect : function () {
			var that = this;
			floppyCarousel.getThumbnails().click(function (e) {
				console.log("clicked");
				floppyCarousel.deleteIntermediateCanvas();
				floppyCarousel.createIntermediateCanvas($(this));
				var startTime = floppyCarousel.getActualTime();
				floppyCarousel.clickedTumbnail = $(this);
				floppyCarousel.animateImage(startTime);
			});
		},
		canvasObj : {},
		canvasElement : $('<canvas id="floppyCanvas" height="1000" width="1300"></canvas>'),
		createIntermediateCanvas : function (sourceThumbnail) {
			floppyCarousel.canvasObj.canvas = floppyCarousel.canvasElement;
			floppyCarousel.canvasObj.canvas.appendTo("body");
			floppyCarousel.canvasObj.context = floppyCarousel.canvasObj.canvas[0].getContext("2d");
			floppyCarousel.canvasObj.imageObj = new Image();
			floppyCarousel.canvasObj.imageObj.src = $(sourceThumbnail).attr('src');
		},
		deleteIntermediateCanvas : function () {
			floppyCarousel.canvasElement.remove();
		},
		clearCanvas : function () {
			floppyCarousel.canvasObj.context.clearRect(
				0,
				0,
				floppyCarousel.canvasObj.canvas[0].width,
				floppyCarousel.canvasObj.canvas[0].height
			);
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
