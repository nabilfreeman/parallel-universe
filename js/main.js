var waitForReady = setInterval(function(){
	if(document.readyState === "complete"){
		clearInterval(waitForReady);
		document.querySelector("body").classList.add("ready");
	}
});

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var canvas_data = {
	
};

var updateCanvasData = function(){
	var cd = canvas_data;

	cd.width = window.innerWidth * 2;
	cd.height = window.innerHeight * 2;

	canvas.setAttribute("width", cd.width);
	canvas.setAttribute("height", cd.height);

	cd.columns = 10;
	cd.divider = Math.floor(cd.width / cd.columns);

	cd.position = cd.width;

	cd.color = {
		h: 258,
		s: 100,
		b: 10,
		a: 0.1
	};
	
};

updateCanvasData();

var iterations = 0;
var draw = function(){
	var cd = canvas_data;

	iterations += 1;
	if(iterations % cd.columns === 0){
		cd.color.h -= 50;
		cd.position = cd.width;
	}

	cd.position -= cd.divider;

	ctx.fillStyle = "hsla(" + cd.color.h + ", " + cd.color.s + "%, " + cd.color.b + "%, " + cd.color.a + ")";

	ctx.fillRect(
		cd.position,
		0,
		cd.width,
		cd.height
	);

	// ctx.fillRect(
	// 	canvas_data.square_position.x,
	// 	canvas_data.square_position.y,
	// 	canvas_data.square_size,
	// 	canvas_data.square_size
	// );
};

var _mad_libs = [
	{"you": [
		{"are": [
			{"a homeless person": []},
			{"nothing": []},
			{"immortal": []},
			{"The President of the United States": []},
			{"a robot": []},
			{"an alien": []},
			{"black": []},
			{"white": []},
			{"a silicon-based life form": []},
			{"Steve Jobs": []},
			{"a billionaire": []},
			{"a trillionaire": []},
			{"a bazillionaire": []},
			{"Iron Man": []},
			{"Captain America": []},
			{"a truck driver": []},
			{"an artist": []},
			{"a scientist": []},
			{"a Nobel Prize winner": []},
			{"the supreme ruler of Glorp V": []},
			{"an absolute top lad": []}
		]},
		{"have": [
			{"a Lamborghini": []},
			{"a hoverboard": []},
			{"green skin": []},
			{"red hair": []},
			{"blue hair": []},
			{"purple hair": []},
			{"no hair": []},
			{"no eyebrows": []}
		]}
	]},
];

//this is a weird tree traversal function that seems to work quite well...
var generate_sentence = function(final_sentence){

	var sentence = "";
	
	//let's seed the scope variable with the top level of the mad libs object.
	var scope = _mad_libs;

	var iterations = 0;

	while(scope.length > 0){

		//we're going to select a random point from the branches. 
		//if there's only one branch, it will select that one.
		var index = Math.floor(Math.random() * scope.length);

		//little object hack to get the first (and only key) in the retrieved object.
		for(key in scope[index]) break;
		sentence += (key + " ");

		if(scope[index][key].length === 0){
			scope.splice(index, 1);
			scope = [];
		} else {
			scope = scope[index][key];
		}

		iterations += 1;
		
	}

	//check if 1) there are any possible entries left in the tree
	//and 2) that the returned sentence is complex enough. if it isn't, we need to traverse again.
	if(_mad_libs.length === 0) return final_sentence;

	if(iterations < 3) return generate_sentence(final_sentence);

	sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
	sentence = sentence.substring(0, sentence.length - 1);

	//return string with first letter capitalised.
	return  sentence + ".";

};

//i know, the callback stuff is groce. but it works!
var write_typewriter_style = function(sentence, element, callback){

	//override the typing function with these three lines:
	// element.innerHTML = sentence;
	// callback();
	// return;

	var i = 0;
	var text = function(words, callback){
		element.innerHTML = element.innerHTML + words[i];

		i++;
		if(i < words.length){
			setTimeout(function(){
				text(words, callback);
			}, 50);
		} else {
			i = 0;
			callback();
		}
	};

	text(sentence, callback);

};

var final_sentence = "... and infinite other things.";

var run = function(){

	//generate our Mad Libs sentence! Soon to be an epic function.
	var sentence = generate_sentence(final_sentence);

	//remove the blinking cursor from the paragraph that was previously written.
	var old_paragraph = document.querySelector("#cases p.active");
	
	if(old_paragraph !== null){
		old_paragraph.classList.remove("active");
	}

	//make a new paragraph and append it to the bottom of our parallel list.
	var paragraph = document.createElement("p");
	paragraph.classList.add("active");

	document.querySelector("#cases").appendChild(paragraph);

	var all_paragraphs = document.querySelectorAll("#cases p");

	if(all_paragraphs.length > 11){
		var el_to_hide = all_paragraphs[all_paragraphs.length - 12];
		el_to_hide.setAttribute("style", "margin-top:-" + el_to_hide.scrollHeight + "px");
		el_to_hide.classList.add("invisible");
	}

	//nifty typewriter function so it looks like a robot from another dimension is writing the function
	write_typewriter_style(sentence, paragraph, function(){
		//if generate sentence returns the final string, the list of entries has been exhausted so we need to stop.
		if(sentence === final_sentence) return;	
		draw();
		run();
		// setTimeout(run, 1000);
	});
}

setTimeout(run, 1500);