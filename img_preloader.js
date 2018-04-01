/**
 * The image preloader module
 */
var imgPreloader = (function() {

	// keep track of the number of images being loaded
	var nTotalImgNum = 0;
	var nLoadedImgNum = 0;
	var nLoadProgress = 0;

	// callback functions and arguments to be invoked on the image load/error events
	var callbackFuncSuccess = null 
	var callbackFuncSuccessArgs = [];
	var callbackFuncFail = null;
	var callbackFuncFailArgs = [];

	/**
	 * The helper function to load the image and create a promise for it
	 * @param string imgSrc: the image source
	 * @return Promise: a Promise object for the image being loaded
	 */
	var loadImgHelper = function( imgSrc ) {
		var imgPromise = new Promise(function(resolve, reject) {
			var imgObj = new Image();

			// success when loading the image (asynchronous)
			imgObj.onload = function() {
				++imgPreloader.nLoadedImgNum;
				imgPreloader.nLoadProgress = 100.0 * (imgPreloader.nLoadedImgNum / imgPreloader.nTotalImgNum);

				if ( imgPreloader.callbackFuncSuccess && typeof imgPreloader.callbackFuncSuccess === "function" ) {
					// callback function
					imgPreloader.callbackFuncSuccess.apply(imgPreloader, imgPreloader.callbackFuncSuccessArgs);
				}

				resolve({
					src: imgSrc,
					status: "ok"
				});
			};

			// error when loading the image (asynchronous)
			imgObj.onerror = function() {
				imgPreloader.nLoadProgress = 100.0 * (imgPreloader.nLoadedImgNum / imgPreloader.nTotalImgNum);

				if ( imgPreloader.callbackFuncFail && typeof imgPreloader.callbackFuncFail === "function" ) {
					// callback function
					imgPreloader.callbackFuncFail.apply(imgPreloader, imgPreloader.callbackFuncFailArgs);
				}

				// use resolve instead of reject on error so it will continue loading the rest of the images
				resolve({
					src: imgSrc,
					status: "error"
				});				
			};

			imgObj.src = imgSrc;
		});

		return imgPromise;
	};

	/**
	 * The main function to preload the images
	 * @param array arrImgSrc: the array containing the promises of images to be loaded
	 * @param function callbackFuncSuccess: the callback function to invoke when the image loading is successful
	 * @param array callbackFuncSuccessArgs: the arguments to the callback function upon success
	 * @param function callbackFuncFail: the callback function to invoke when the image loading fails
	 * @param array callbackFuncFailArgs: the arguments to the callback function upon failure
	 * @return Object: an object {src, status} which is the result of Promise.resolve()
	 */
	var preloadImages = function( arrImgSrc, 
		callbackFuncSuccess, callbackFuncSuccessArgs, 
		callbackFuncFail, callbackFuncFailArgs ) {

		try {
			if ( arrImgSrc.constructor !== Array ) {
				throw new Error("The parameter should be an array");
			}

			imgPreloader.nTotalImgNum = arrImgSrc.length;

			// handle the default parameters of the callback if not provided
			if ( typeof callbackFuncSuccess === "undefined" || !callbackFuncSuccess ) {
				callbackFuncSuccess = null;
			}
			if ( typeof callbackFuncSuccessArgs === "undefined" || !callbackFuncSuccessArgs ) {
				callbackFuncSuccessArgs = [];
			}
			if ( typeof callbackFuncFail === "undefined" || !callbackFuncFail ) {
				callbackFuncFail = null;
			}
			if ( typeof callbackFuncFailArgs === "undefined" || !callbackFuncFailArgs ) {
				callbackFuncFailArgs = [];
			}

			// set the callback functions and arguments
			imgPreloader.callbackFuncSuccess = callbackFuncSuccess 
	 		imgPreloader.callbackFuncSuccessArgs = callbackFuncSuccessArgs;
			imgPreloader.callbackFuncFail = callbackFuncFail;
			imgPreloader.callbackFuncFailArgs = callbackFuncFailArgs;

			var arrImgPromises = new Array();

			// prepare the promises for loading each image
			arrImgSrc.forEach(function( imgSrc ) {
				var imgPromise = loadImgHelper(imgSrc);
				arrImgPromises.push( imgPromise );
			});

			// process all the promises in a batch
			return Promise.all( arrImgPromises );

		} catch (err) {
			return Promise.reject(err);
		}		
	};


	return {
		preloadImages: preloadImages,
		nTotalImgNum: nTotalImgNum,
		nLoadedImgNum: nLoadedImgNum,
		nLoadProgress: nLoadProgress
	}

})();
