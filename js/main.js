/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery */

(function ($) {
	"use strict";
    var floppyCarousel = {
	
		init : function (settings) {
			floppyCarousel.config = {
				destinationImage : ".image-container",
				thumbnails : $(".thumbnail-container img"),
				speed : 1
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

			var xRatio = Math.abs(horizontalDistance) / Math.abs(verticalDistance) * floppyCarousel.config.speed;
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
			return { xProgress : floppyCarousel.xProgress, yProgress : floppyCarousel.yProgress };
		},
		
		animateImage : function (startTime) {
			// update
			var time = floppyCarousel.getActualTime() - startTime;

			var linearSpeed = 390;
			// pixels / second
			var newX = linearSpeed * time / 1000;

			floppyCarousel.clearCanvas();

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
				console.log("yprogress" + floppyCarousel.getXYStep().yProgress);
				var diff = (floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).y) - (floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y);
				console.log("DestinationImage" + diff);
				if (Math.abs(floppyCarousel.getXYStep().yProgress) >= Math.abs(diff)) {
					floppyCarousel.deleteIntermediateCanvas();
				}
			});
		
		},
		beginEffect : function () {
			var that = this;
			floppyCarousel.getThumbnails().click(function (e) {
				floppyCarousel.deleteIntermediateCanvas();
				floppyCarousel.createIntermediateCanvas($(this));
				var startTime = floppyCarousel.getActualTime();
				floppyCarousel.clickedTumbnail = $(this);
				floppyCarousel.animateImage(startTime);
			});
		},
		canvasObj : {},
		canvasElement : $('<canvas id="floppyCanvas" height="1000" width="1000"></canvas>'),
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
