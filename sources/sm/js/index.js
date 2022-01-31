


window.onload = LoadStoryText();

function LoadStoryText()
{
	console.log("M");
	
	
	$.ajax({
		url : "docs/SimonSaysStory.txt",
		dataType: "html",
		success : function(data){var oldHTML = $("#Story").html(); $("#Story").html(oldHTML + data)}
	});
}