/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global jQuery */

(function ($) {
	"use strict";
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");
    var imageObj = new Image(), sourceY = 0;
	//Si on veut cropper l'image sans aucun effet de zoom il faut que sourceWidth soit égale à destWidth Le 4eme est le 8ieme
	imageObj.src = 'img/sports-q-c-1024-768-5.jpg';

	imageObj.onload = function () {
		for (sourceY = 0; sourceY < 768; sourceY++) { console.log('ddd');
			context.drawImage(imageObj, 0, sourceY, 1024 + sourceY, 1, 0, sourceY, 1024, 1);
		}
	};

	
	
	
	/*
	imageObj.onload = function () {
        context.drawImage(imageObj, 0, 0, 700, 600, 300, 400, 555, 777);
		context.drawImage(imageObj, 0, 0, 700, 600, 0, 0, 555, 777);
    };
    */
	
}(jQuery));//End of musuem plugin global closure
