var waitForReady = setInterval(function(){
	if(document.readyState === "complete"){
		clearInterval(waitForReady);
		document.querySelector("body").classList.add("ready");
	}
});