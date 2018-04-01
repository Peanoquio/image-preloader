
var callbackFuncSuccessArgs = ["image load successful!", "logging image load progress..."];
var callbackFuncFailArgs = ["image load failed!", "logging image load progress..."];

// the callback function that will be called upon triggered the image load/error events
function callbackFunc( strMsg, strMsg2 ) {
	console.log(strMsg);
	console.log(strMsg2);
	// the callback function will have access to the member variables of the imgPreloader module because the function will be bound to the context of imgPreloader
	console.log("progress: " + this.nLoadProgress + "% (" + this.nLoadedImgNum + "/" + this.nTotalImgNum + ")");
}


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


// test passing an invalid parameter
imgPreloader.preloadImages("invalid parameter").then(function( imgStatusFromResolve ) {  
	// object from Promise.resolve
    console.log(imgStatusFromResolve);
}, function( imgErrorFromReject ) {
	// object from Promise.reject
    console.log(imgErrorFromReject);
});