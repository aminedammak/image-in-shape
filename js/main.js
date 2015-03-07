/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery */

(function ($) {
	"use strict";
	//principal literal object
    var floppyCarousel = {
	
		init : function (settings) {
			floppyCarousel.config = {
				destinationImage : ".image-container",
				thumbnails : $(".thumbnail-container img"),
				speed : 3,
				fitSpeed : 10
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
		xProgressLateralFit : 0,

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
			
			return { xProgress : floppyCarousel.xProgress, yProgress : floppyCarousel.yProgress, wProgress : floppyCarousel.wProgress, hProgress : floppyCarousel.hProgress, xRatio : xRatio };
		},
		animateImage : function (startTime) {
			floppyCarousel.clearCanvas();
			floppyCarousel.deformLateral(floppyCarousel.canvasObj.imageObj, Math.abs(floppyCarousel.getXYStep().yProgress),
										 floppyCarousel.canvasObj.imageObj.width,
										 floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).width + floppyCarousel.getXYStep().wProgress,
										 floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).x + floppyCarousel.getXYStep().xProgress,
										 floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y + floppyCarousel.getXYStep().yProgress,
										 floppyCarousel.getXYStep().xProgress,
										 floppyCarousel.getXYStep().wProgress);
			
			// request new frame
			window.requestAnimFrame(function () {
				//Object containing the returned object of the getXYStep() function
				var XYStepProgress = floppyCarousel.getXYStep();
				var diff = (floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).y) - (floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y);
				//if the animated image rich the top left corner of the destination image
				if (Math.abs(XYStepProgress.yProgress) >= Math.abs(diff)) {
					floppyCarousel.destHeightfit = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).height;
					floppyCarousel.clickedThWfit = floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).width + XYStepProgress.wProgress;
					floppyCarousel.clickedThWxfit = floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).x + XYStepProgress.xProgress;
					floppyCarousel.xProgressfit = XYStepProgress.xProgress;
					floppyCarousel.wProgressfit = XYStepProgress.wProgress;
					floppyCarousel.clickedThWyfit = floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y + XYStepProgress.yProgress;
					floppyCarousel.fitToDestination();
				} else {
					//Continue animation
					floppyCarousel.animateImage(startTime);
				}
			});
		},
		fitToDestination : function () {
			floppyCarousel.clearCanvas();
			floppyCarousel.deformLateralFit(floppyCarousel.canvasObj.imageObj,
										 floppyCarousel.destHeightfit,
										 floppyCarousel.canvasObj.imageObj.width,
										 floppyCarousel.clickedThWfit,
										 floppyCarousel.clickedThWxfit,
										 floppyCarousel.clickedThWyfit,
										 floppyCarousel.xProgressfit,
										 floppyCarousel.wProgressfit);
			window.requestAnimFrame(function () {
				if (floppyCarousel.xProgressLateralFit < floppyCarousel.xProgressfit) {
					floppyCarousel.fitToDestination();
				} else {
					//Reset progress
					floppyCarousel.yProgress = 0;
					floppyCarousel.xProgress = 0;
					floppyCarousel.wProgress = 0;
					floppyCarousel.hProgress = 0;
					floppyCarousel.xProgressLateralFit = 0;
				}
			});
		},
		deformLateralFit : function (imageObj, imgHeight, imgWidth, imgDestWidth, imgX, imgY, xProgress, wProgress) {
			var imgXIncline = 0;
			var imgWidthIncline = 0;
			var sourceY;
			floppyCarousel.xProgressLateralFit += floppyCarousel.config.speed * floppyCarousel.config.fitSpeed;
			console.log(floppyCarousel.xProgressLateralFit);
			function stepFit(i) {
				return floppyCarousel.xProgressLateralFit * i / imgHeight;
			}
			for (sourceY = 0; sourceY < imgHeight; sourceY++) {
				var stepFitval = stepFit(sourceY);
				var imgXstepFit = imgX - imgXIncline + stepFitval;
				floppyCarousel.canvasObj.context.drawImage(imageObj, 0, sourceY, imgWidth, 1, imgXstepFit, imgY + sourceY, imgDestWidth, 1);
				imgXIncline += xProgress / imgHeight;
			}
		},
		deformLateral : function (imageObj, imgHeight, imgWidth, imgDestWidth, imgX, imgY, xProgress, wProgress) {
			var imgXIncline = 0;
			var imgWidthIncline = 0;
			var sourceY;
			for (sourceY = 0; sourceY < imgHeight; sourceY++) {
				floppyCarousel.canvasObj.context.drawImage(imageObj, 0, sourceY, imgWidth, 1, imgX - imgXIncline, imgY + sourceY, imgDestWidth - imgWidthIncline, 1);
				imgXIncline += xProgress / imgHeight;
				imgWidthIncline += wProgress / imgHeight;
				floppyCarousel.imgWidthIncline = imgWidthIncline;
			}
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
