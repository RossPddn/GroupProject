var config = {
    apiKey: "AIzaSyAlAKpkcrDEc5hQ_53yAuOvZ1JE64Isuu4",
    authDomain: "coin-flip-9da4e.firebaseapp.com",
    databaseURL: "https://coin-flip-9da4e.firebaseio.com",
    projectId: "coin-flip-9da4e",
    storageBucket: "",
    messagingSenderId: "839637676952"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {
  
  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }

});
 // When first loaded or when the connections list changes...
 connectionsRef.on("value", function(snap) {

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#online").text(snap.numChildren());
  });
  var baseTime 		 = "1531389600"; // subtract this by the Date.now() and the % to get remainder.
	var clearDiv 		 = 0;
	var pastResultsArray = [];
	var currentUrl		 = '';
	var timerStart		 = 5;	// this variable will dictate how long the timer will last 
	var flipTimer;

	// keeps track of the clearDiv by storing the value in Firebase's Database
	// the purpose of this is to make sure the div doesn't get too big.
	// so when clearDiv variable goes past 10, we will clear the div.
	database.ref("/pastResultsCounter").on("value", function(snapshot) {
		
		clearDiv = snapshot.val().resultContainer;

	});

	database.ref("/pastResultsCounter").on("value", function(snapshot) {

		pastResultsArray = snapshot.val().pastResultsArray;
		
		$('#pastResults').text('');
		
		for (var i = 0; i < pastResultsArray.length; i++) {
			var p = $('<p>').text(pastResultsArray[i]);
			$('#pastResults').append(p);
		}

		$('.images').attr('src', snapshot.val().imgUrl);

	});

	database.ref('/globalTimer').on('value', function(snapshot) {

		globalTimer = snapshot
	})

	// this function flips coin and randomizes which will be displayed depending 
	// on the randomization.

	function flipCoin() {
        
		var random = Math.floor(Math.random() * 2);

		if (random == 0) {
			
			$('.images').attr('src', 'http://random-ize.com/coin-flip/us-quarter/us-quarter-front.jpg');
			$('#pastResults').append('Heads');
			
			pastResultsArray.push('Heads');
			clearDiv++;
			
			database.ref("/pastResultsCounter").set({
        		resultContainer: clearDiv,
        		pastResultsArray,
        		imgUrl: 'http://random-ize.com/coin-flip/us-quarter/us-quarter-front.jpg'
     		});
		
		} else if (random == 1) {
			
			$('.images').attr('src', 'http://random-ize.com/coin-flip/us-quarter/us-quarter-back.jpg');
			$('#pastResults').append('Tails');
			pastResultsArray.push('Tails');
			clearDiv++;

			database.ref("/pastResultsCounter").set({
        		resultContainer: clearDiv,
        		pastResultsArray,
        		imgUrl: 'http://random-ize.com/coin-flip/us-quarter/us-quarter-back.jpg'
     		});
		}
	}

			// when user clicks button run the game
	$(document).on('click','#btn',function() {
        event.preventDefault();
		// evertime userclicks, make a new random
		// get user choice 

		// clearDiv is used to clear pastResults div when it get's too full
		if(clearDiv > 10) {

			$('#pastResults').text('');
			clearDiv = 0;
			pastResultsArray = [];

		}
		
		flipCoin();
	});