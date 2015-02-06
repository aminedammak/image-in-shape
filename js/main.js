/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery */

(function ($) {
	"use strict";
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");
    var imageObj = new Image(), sourceY = 0;
	//Si on veut cropper l'image sans aucun effet de zoom il faut que sourceWidth soit égale à destWidth Le 4eme est le 8ieme
	imageObj.src = 'img/sports-q-c-1024-768-5.jpg';

	window.requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	}());
	
	function drawImage(ytransition, wdeform) {
		for (sourceY = 0; sourceY < 768; sourceY++) { 
				context.drawImage(imageObj, 0, sourceY, 1024 + wdeform*sourceY/1000, 1, 0, sourceY + ytransition, 1024, 1);
			}
	}

	function animate(startTime) {
		// update
        var time = (new Date()).getTime() - startTime;
		
		var linearSpeed = 190;
        // pixels / second
        var newX = linearSpeed * time / 1000;
		console.log(newX);

		// clear
        context.clearRect(0, 0, canvas.width, canvas.height);
		
		drawImage(0, newX);
		
		// request new frame
        requestAnimFrame(function () {
			animate(startTime);
        });
	}
	var startTime = (new Date()).getTime();
	animate(startTime);

	
}(jQuery));//End of musuem plugin global closure
