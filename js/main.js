/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery */

(function ($) {
	"use strict";
	//principal literal object
    var floppyCarousel = {
	
		/*
			Funciton that specify settings and 
		  	@params settings object that will replace the default floppyCarousel.config object
		 */
		init : function (settings) {
			floppyCarousel.config = {
				//DOM Element in which the big image will be placed
				destinationImage : ".image-container",
				
				//List of thumbnail images on which we click to launch the animation
				thumbnails : $(".thumbnail-container img"),
				
				//Seed of the animation form the clicked thumbnail to the top of the destination image
				speed : 6,
				
				//Speed of the animation: begin when the animated image rich the top of the destination image and end when the animated image become exactly equal te the destionation image
				fitSpeed : 4
			};
			
			//Merge the content of the settings object in the floppyCarousel.config object
			$.extend(floppyCarousel.config, settings);
			
			//Begin
			floppyCarousel.beginEffect();
		},
		getDestinationImage : function () {
			return $(floppyCarousel.config.destinationImage).eq(0);
		},
		
		/*
		 *	retun the list of thumbnail
		 */
		getThumbnails : function () {
			return $(floppyCarousel.config.thumbnails);
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
		imageFitDestinationFully : false,

		getXYStep : function () {

			var verticalDistance = floppyCarousel.getDestinationImageY -  floppyCarousel.getClickedTumbnailY;

			floppyCarousel.horizontalDistance = floppyCarousel.getDestinationImageX -  floppyCarousel.getClickedTumbnailX;
			var widthDifference = floppyCarousel.getDestinationImageWidth - floppyCarousel.getClickedTumbnailWidth;
			var heightDifference = floppyCarousel.getDestinationImageHeight - floppyCarousel.getClickedTumbnailHeight;
			var xRatio = Math.abs(floppyCarousel.horizontalDistance) / Math.abs(verticalDistance) * floppyCarousel.config.speed;
			var widthRadio = Math.abs(widthDifference) / Math.abs(verticalDistance) * floppyCarousel.config.speed;
			var heightRadio = Math.abs(heightDifference) / Math.abs(verticalDistance) * floppyCarousel.config.speed;
			if (verticalDistance < 0) {
				floppyCarousel.yProgress -= floppyCarousel.config.speed;
			} else if (verticalDistance > 0) {
				floppyCarousel.yProgress += floppyCarousel.config.speed;
			}
			if (floppyCarousel.horizontalDistance < 0) {
				floppyCarousel.xProgress -= xRatio;
			} else if (floppyCarousel.horizontalDistance > 0) {
				floppyCarousel.xProgress += xRatio;
			}
			floppyCarousel.wProgress += widthRadio;
			floppyCarousel.hProgress += heightRadio;
			
			return { xProgress : floppyCarousel.xProgress, yProgress : floppyCarousel.yProgress, wProgress : floppyCarousel.wProgress, hProgress : floppyCarousel.hProgress, xRatio : xRatio };
		},
		animateImage : function () {
			floppyCarousel.getDestinationImageX = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).x ;
			floppyCarousel.getDestinationImageY = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).y ;
			floppyCarousel.getDestinationImageHeight = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).height;
			floppyCarousel.getDestinationImageWidth = floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).width ;


			floppyCarousel.getClickedTumbnailX = floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).x;
			floppyCarousel.getClickedTumbnailY = floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).y;
			floppyCarousel.getClickedTumbnailWidth = floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).width;
			floppyCarousel.getClickedTumbnailHeight = floppyCarousel.getDimCord(floppyCarousel.clickedTumbnail).height;


			floppyCarousel.clearCanvas();
			floppyCarousel.deformLateral(floppyCarousel.canvasObj.imageObj, Math.abs(floppyCarousel.getXYStep().yProgress),
										 floppyCarousel.canvasObj.imageObj.width,
										 floppyCarousel.getClickedTumbnailWidth + floppyCarousel.getXYStep().wProgress,
										 floppyCarousel.getClickedTumbnailX + floppyCarousel.getXYStep().xProgress,
										 floppyCarousel.getClickedTumbnailY + floppyCarousel.getXYStep().yProgress,
										 floppyCarousel.getXYStep().xProgress,
										 floppyCarousel.getXYStep().wProgress);
			
			// request new frame
			window.requestAnimFrame(function () {
				//Object containing the returned object of the getXYStep() function
				var XYStepProgress = floppyCarousel.getXYStep();
				var diff = (floppyCarousel.getDestinationImageY) - (floppyCarousel.getClickedTumbnailY);
				//if the animated image rich the top left corner of the destination image
				if (Math.abs(XYStepProgress.yProgress) >= Math.abs(diff)) {
					floppyCarousel.destHeightfit = floppyCarousel.getDestinationImageHeight;
					floppyCarousel.clickedThWfit = floppyCarousel.getClickedTumbnailWidth + XYStepProgress.wProgress;
					floppyCarousel.clickedThWxfit = floppyCarousel.getClickedTumbnailX + XYStepProgress.xProgress;
					floppyCarousel.xProgressfit = XYStepProgress.xProgress;
					floppyCarousel.wProgressfit = XYStepProgress.wProgress;
					floppyCarousel.clickedThWyfit = floppyCarousel.getClickedTumbnailY + XYStepProgress.yProgress;
					floppyCarousel.fitToDestination();
				} else {
					//Continue animation
					floppyCarousel.animateImage();
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
				if (floppyCarousel.imageFitDestinationFully && (Math.abs(floppyCarousel.xProgressLateralFit) >= Math.abs(floppyCarousel.xProgressfit)) ) {
					floppyCarousel.deleteIntermediateCanvas();
					//Reset progress
					floppyCarousel.yProgress = 0;
					floppyCarousel.xProgress = 0;
					floppyCarousel.wProgress = 0;
					floppyCarousel.hProgress = 0;
					floppyCarousel.xProgressLateralFit = 0;
					floppyCarousel.imageFitDestinationFully = false;
				} else {
					floppyCarousel.fitToDestination();
				}
			});
		},

		deformLateralFit : function (imageObj, imgHeight, imgWidth, imgDestWidth, imgX, imgY, xProgress, wProgress) {
			var imgXIncline = 0;
			var imgWIncline = 0;
			var sourceY;
			var operator = 1;
			if (floppyCarousel.horizontalDistance < 0) {
				floppyCarousel.xProgressLateralFit -= floppyCarousel.config.speed * floppyCarousel.config.fitSpeed;
				operator = -1;
			} else if (floppyCarousel.horizontalDistance > 0) {
				floppyCarousel.xProgressLateralFit += floppyCarousel.config.speed * floppyCarousel.config.fitSpeed;
			}

			function stepFit(i) {
				return floppyCarousel.xProgressLateralFit * i / imgHeight;
			}
			for (sourceY = 0; sourceY < imgHeight; sourceY++) {
				var stepFitval = stepFit(sourceY);
				var imgWstepFit, imgXstepFit;
				if(!floppyCarousel.imageFitDestinationFully) {
					imgWstepFit = imgDestWidth - imgWIncline + stepFitval * operator *  Math.abs(imgWIncline / imgXIncline) ;
				} else {
					imgWstepFit = imgWidth;
				}
				if (Math.abs(floppyCarousel.xProgressLateralFit) >= Math.abs(floppyCarousel.xProgressfit)) {
					imgXstepFit = floppyCarousel.getDestinationImageX;
				} else {
					imgXstepFit = imgX - imgXIncline + stepFitval;
				}
				floppyCarousel.canvasObj.context.drawImage(imageObj, 0, sourceY, imgWidth, 1, imgXstepFit, imgY + sourceY, imgWstepFit, 1);
				imgXIncline += xProgress / imgHeight;
				imgWIncline += wProgress / imgHeight;
				if (sourceY === imgHeight - 1) {
					if (imgWstepFit >= imgDestWidth) {
						floppyCarousel.imageFitDestinationFully = true;
					}
				}
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
		/**
		 *	Function trigger the animation when clicking the thumbnail
		 */
		beginEffect : function () {
			floppyCarousel.getThumbnails().click(function (e) {
				floppyCarousel.createIntermediateCanvas($(this));
				floppyCarousel.clickedTumbnail = $(this);
				floppyCarousel.animateImage();
			});
		},
		canvasObj : {},
		canvasElement : $('<canvas id="floppyCanvas" height="1000" width="1300"></canvas>'),
		
		/**
		 * Create a canvas that will show the animated image
		 * @param sourceThumbnail the image that will be animated
		 */
		createIntermediateCanvas : function (sourceThumbnail) {
			floppyCarousel.canvasObj.canvas = floppyCarousel.canvasElement;
			floppyCarousel.canvasObj.canvas.appendTo("body");
			floppyCarousel.canvasObj.context = floppyCarousel.canvasObj.canvas[0].getContext("2d");
			floppyCarousel.canvasObj.imageObj = new Image();
			floppyCarousel.canvasObj.imageObj.src = $(sourceThumbnail).attr('src');
			//floppyCarousel.outputImage will be a copy of the floppyCarousel.canvasObj.imageObj having the same dimension as the destination area
			floppyCarousel.createImageHavingDestinationImgDimensions();
			floppyCarousel.canvasObj.imageObj.src = floppyCarousel.outputImage.attr('src');
		},
		deleteIntermediateCanvas : function () {
			floppyCarousel.canvasElement.remove();
			floppyCarousel.canvasForResizing.remove();
			floppyCarousel.imgForResizing.remove();
		},
		clearCanvas : function () {
			floppyCarousel.canvasObj.context.clearRect(
				0,
				0,
				floppyCarousel.canvasObj.canvas[0].width,
				floppyCarousel.canvasObj.canvas[0].height
			);
		},

		/**
	     * Create an image having the same dimension as the destination area 
		 */
		createImageHavingDestinationImgDimensions : function () {
			floppyCarousel.canvasForResizing = $("<canvas id='resizing_canvas'></canvas>");
			floppyCarousel.imgForResizing = $("<img id='outputImage' />");

			floppyCarousel.canvasForResizing.appendTo("body");
			floppyCarousel.imgForResizing.appendTo("body");
			var c = document.getElementById('resizing_canvas');
			floppyCarousel.canvasForResizing.attr('height', floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).height);
			floppyCarousel.canvasForResizing.attr('width', floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).width);
			c.getContext("2d").drawImage(floppyCarousel.canvasObj.imageObj, 0, 0, floppyCarousel.canvasObj.imageObj.width, floppyCarousel.canvasObj.imageObj.height, 0, 0, floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).width, floppyCarousel.getDimCord(floppyCarousel.getDestinationImage()).height);
			$('#outputImage').attr('src', c.toDataURL("image/jpeg"));
			floppyCarousel.outputImage = $('#outputImage');
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
