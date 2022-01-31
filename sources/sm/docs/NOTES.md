

## Inserting External Text
The *Epic Of Creation* text is inserted from a loacl text file using a jquery ajax request.
```javascript
	$.ajax({
		url : "docs/SimonSaysStory.txt",
		dataType: "html",
		success : function(data){var oldHTML = $("#Story").html(); $("#Story").html(oldHTML + data)}
	});
```


## Module Structure
The core of the game game is wraped in a SimonSays module wich is immediately created at the
start using an IIFE **(Immediately Invoked Function Expression)**.


## Game Board Size
The actual game board **(encapsulated by <div class="GameContainer">)** is not responsive in
terms of design. Sizes between 500px and 600px **(widht and height)** work best. Any smaller
or larger and other modifications must be made.