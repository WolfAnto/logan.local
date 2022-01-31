//Uses jquery

var SimonSays = (function() {
	
	var gameContainer;	//HTML element that holds the Simon game
	var audioPlayer;	//HTML <audio> element
	var strictMode = false;
	var gameState = "stoped";
	
	var score = 1;
	var maxScore = 25;
	var playerSequence = [];	//Sequence of moves
	var gameSequence = [];
	var gameSequenceIndex = 0;
	
	var gameTimerHandle = -1;
	var flashTimerHandle = -1;

	var gameStartDelay = 1;
	var playerStartDelay = 0.5;
	var gameSequenceDelay = 0.7;
	var simulatedButtonDuration = 0.5;

	var sounds =
	{
		buttonSounds:
		[
			"https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
			"https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
			"https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
			"https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
		],
		
		startSound: "http://www.pacdv.com/sounds/interface_sound_effects/sound18.mp3",
		winSound: "http://www.pacdv.com/sounds/interface_sound_effects/sound22.mp3",
		loseSound: "http://www.pacdv.com/sounds/interface_sound_effects/sound8.mp3",
		
		PlayButtonSound: function(button)
		{
			var buttonID = button.getAttribute("data-button-id");
			
			audioPlayer.src = this.buttonSounds[buttonID];
			audioPlayer.play();
		},
		PlayStartSound: function()
		{
			audioPlayer.src = this.startSound;
			audioPlayer.play();
		},
		PlayWinSound: function()
		{
			audioPlayer.src = this.winSound;
			audioPlayer.play();
		},
		PlayLoseSound: function()
		{
			audioPlayer.src = this.loseSound;
			audioPlayer.play();
		},
	}

	function RandomInt(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

/*==========================================================================*/
	
	function UnblockPlayer()
	{
		$(gameContainer).find(".CoreButton").addClass("Clickable");
	}
	function BlockPlayer()
	{
		$(gameContainer).find(".CoreButton").removeClass("Clickable");
	}
	
/*==========================================================================*/

	function SimulateButtonClick(buttonElement)
	{
		buttonElement.className += " Clicked";
		setTimeout(function(){$(buttonElement).removeClass("Clicked")}, simulatedButtonDuration * 1000);
	}
	
	function IncrementScore(ammount)
	{
		score += ammount;
		var scoreUI = gameContainer.getElementsByClassName("PlateScore")[0];
		scoreUI.textContent = score;
		
		if( (score + "").length < 2)
		{
			scoreUI.textContent = "0" + score;
		}
	}
	function SetScore(ammount)
	{
		score = ammount;
		var scoreUI = gameContainer.getElementsByClassName("PlateScore")[0];
		scoreUI.textContent = score;
		
		if( (score + "").length < 2)
		{
			scoreUI.textContent = "0" + score;
		}
	}
	function FlashText(content, defaultContent, repetitions, delay, finishCallback, count)	//Flash some content on the score display
	{
		if(count == undefined){count = 0}
		
		var scoreUI = gameContainer.getElementsByClassName("PlateScore")[0];
		if(scoreUI.textContent == content){scoreUI.textContent = defaultContent}
		else{scoreUI.textContent = content}
		
		count += 1;
		if(count >= repetitions)
		{
			finishCallback;
			flashTimerHandle = -1;
		}
		else
		{
			flashTimerHandle = setTimeout(function(){FlashText(content, defaultContent, repetitions, delay, finishCallback, count)}, delay * 1000);
		}
			
	}

/*==========================================================================*/

	function GameToggle()
	{
		gameContainer = document.getElementById("GameContainer");
		audioPlayer = gameContainer.getElementsByTagName("audio")[0];
		score = 1;
		gameState = "started";
		playerSequence = [];
		gameSequence = [];
		gameSequenceIndex = 0;
		
		SetScore(1);
		BlockPlayer(gameContainer);
		sounds.PlayStartSound();
		clearTimeout(gameTimerHandle);
		clearTimeout(flashTimerHandle);
		gameTimerHandle = setTimeout(GameMakeMove, (gameStartDelay + 0.5) * 1000);
		
	}
	function ToggleStrictMode()
	{
		strictMode = !strictMode;
		
		if(gameContainer == undefined){gameContainer = document.getElementById("GameContainer") }
		var toggleIndicator = gameContainer.getElementsByClassName("PlateIndicatorLight")[0];
		$(toggleIndicator).toggleClass("PlateIndicatorLightOff");
	}

/*==========================================================================*/

	function PlayerMakeMove(button)
	{
		if($(button).hasClass("Clickable") == false){return;}
		sounds.PlayButtonSound(button);
		
		if(gameSequence[playerSequence.length] == button)	//Player has made the right move
		{
			playerSequence.push(button);
			if(playerSequence.length == gameSequence.length)	//Player has made ALL the right moves
			{
				playerSequence = [];
				BlockPlayer();
				IncrementScore(1);
				if(score > maxScore)
				{
					sounds.PlayWinSound();
					FlashText("WIN", "--", 12, 0.5, GameToggle);
				}
				else
				{
					gameTimerHandle = setTimeout(GameMakeMove, gameSequenceDelay * 1000);
				}
			}
		}
		else	//Player has made wrong move
		{
			if(strictMode == true){GameToggle(); return}
			
			playerSequence = [];
			BlockPlayer();
			sounds.PlayLoseSound();
			gameTimerHandle = setTimeout(function(){GameMakeMove(true)}, gameSequenceDelay * 1000);	
		}
	}

	function GameMakeMove(repeatOnly)
	{
		if(repeatOnly == undefined){repeatOnly = false}
		var buttons = $(gameContainer).find(".CoreButton");
		
		if(gameSequenceIndex >= gameSequence.length) //No more moves left to repeat.
		{
			if(repeatOnly == false)	//Make a new move
			{
				var newButton = buttons[RandomInt(0, buttons.length-1)];
				sounds.PlayButtonSound(newButton);
				SimulateButtonClick(newButton);
				gameSequence.push(newButton);
			}
			gameSequenceIndex = 0;
			setTimeout(UnblockPlayer, playerStartDelay * 1000);	//Let the player try now
		}
		else	//Keep repeating moves
		{
			var buttonToRepeat = gameSequence[gameSequenceIndex];
			sounds.PlayButtonSound(buttonToRepeat);
			SimulateButtonClick(buttonToRepeat);
			gameSequenceIndex += 1;
			gameTimerHandle = setTimeout(function(){GameMakeMove(repeatOnly)}, gameSequenceDelay * 1000);
		}
	}

/*==========================================================================*/
	
	return {
		PlayerMakeMove : PlayerMakeMove,
		GameToggle : GameToggle,
		ToggleStrictMode : ToggleStrictMode,
	};

}) ();


