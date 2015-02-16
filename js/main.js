/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery */

(function ($) {
	"use strict";
    /*var canvas = document.getElementById('canvas');
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
*/
		window.requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	}());
	
	
	
	//animate using canvas intermediate
	var $animCanvas = $('<canvas id="animCan" height="1000" width="1000"></canvas>');
	$animCanvas.appendTo("body");
	var context = $animCanvas[0].getContext("2d");
	var imageObj = new Image();
	imageObj.src = 'img/sports-q-c-1024-768-5.jpg';

	function animCanInterm (startTime) {

		// update
        var time = (new Date()).getTime() - startTime;
		
		var linearSpeed = 190;
        // pixels / second
        var newX = linearSpeed * time / 1000;
		var newY = (3/2)*newX
		console.log("newX"+newX);

		// clear
        context.clearRect(0, 0, $animCanvas[0].width, $animCanvas[0].height);
		
		if(newX < 250) { 
			context.drawImage(imageObj, 0, 0, 1024, 768, newX, newY, 100+newX, 100+newX);
		} else {
			$animCanvas[0].remove();
		}
		// request new frame
        requestAnimFrame(function () {
			animCanInterm(startTime);
        });
		
	}

	
	
		var startTime = (new Date()).getTime();
	animCanInterm(startTime);
}(jQuery));//End of musuem plugin global closure
