# image-preloader
A JavaScript utility module that will support image preloading for the browser

> To run a sample of how this works, simply run `test_img_preloader.html` through a web browser.

## Usage

### Preloading images

`imgPreloader.preloadImages()` will take in an array of image sources to load.
It will then return a Promise (resolve or reject) depending on whether the image loads successfully or not.
It also supports accepting callback functions (eg. you want to show a progress bar while each image successfully loads).
If one of the images failed to load, it will still continue to load the rest of the images.

```js

// the callback function arguments should be in array format
var callbackFuncSuccessArgs = ["image load successful!", "logging image load progress..."];
var callbackFuncFailArgs = ["image load failed!", "logging image load progress..."];

// the callback function that will be called upon triggered the image load/error events
function callbackFunc( strMsg, strMsg2 ) {
	console.log(strMsg);
	console.log(strMsg2);
	// the callback function will have access to the member variables of the imgPreloader module because the function will be bound to the context of imgPreloader
	console.log("progress: " + this.nLoadProgress + "% (" + this.nLoadedImgNum + "/" + this.nTotalImgNum + ")");
}

// the image sources to load
var arrImgSrc = [
	"images/number_text_1.png", 
	"images/number_text_2.png", 
	"images/number_text_3.png", 
	"invalid_src",
	"images/number_text_4.png",
	"images/number_text_5.png"
	];

// test the preloading of the images
imgPreloader.preloadImages(arrImgSrc, 
	callbackFunc, callbackFuncSuccessArgs, 
	callbackFunc, callbackFuncFailArgs).then(function( imgStatusFromResolve ) {  
	
	// object from Promise.resolve
    console.log(imgStatusFromResolve);

    // display the images
    var docFrag = document.createDocumentFragment();
    imgStatusFromResolve.forEach(function( imgStatusObj ) {
    	if ( imgStatusObj.status === "ok" ) {
    		var imgElem = document.createElement("img");
    		imgElem.setAttribute("src", imgStatusObj.src);
    		docFrag.appendChild(imgElem);
    	}
    } );
    var mainElem = document.getElementById("main");
    mainElem.appendChild(docFrag);

}, function( imgErrorFromReject ) {
	// object from Promise.reject
    console.log(imgErrorFromReject);
});
```

## Dependencies

Your web browser should be able to support JS Promises.

## License

This is an open source project under the MIT license.  For more information, please refer to [license.txt](license.txt) 
