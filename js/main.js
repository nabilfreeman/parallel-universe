var waitForReady = setInterval(function(){
	if(document.readyState === "complete"){
		clearInterval(waitForReady);
		document.querySelector("body").classList.add("ready");
	}
});

//i know, the callback stuff is groce. but it works!
var write_typewriter_style = function(sentence, element, callback){

	var i = 0;
	var text = function(words, callback){
		element.innerHTML = element.innerHTML + words[i];

		i++;
		if(i < words.length){
			setTimeout(function(){
				text(words, callback);
			}, 30);
		} else {
			i = 0;
			callback();
		}
	};

	text(sentence, callback);

};

var run = function(){
	//generate our Mad Libs sentence! Soon to be an epic function.
	var sentence = "You are an absolute top lad.";

	//remove the blinking cursor from the paragraph that was previously written.
	var old_paragraph = document.querySelector("#cases p.active");
	
	if(old_paragraph !== null){
		old_paragraph.classList.remove("active");
	}

	//make a new paragraph and append it to the bottom of our parallel list.
	var paragraph = document.createElement("p");
	paragraph.classList.add("active");

	document.querySelector("#cases").appendChild(paragraph);

	//nifty typewriter function so it looks like a robot from another dimension is writing the function
	write_typewriter_style(sentence, paragraph, function(){
		setTimeout(run, 500);
	});
}

setTimeout(run, 1500);