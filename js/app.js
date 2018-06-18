// Elements from DOM
let board = document.getElementById('matching-game');
let refresh = document.getElementById('refresh');
let counter = document.getElementById('count');
let timer = document.getElementById('timer');

// Get the modal
let modal = document.getElementById('myModal');
modal.setAttribute('style', 'display: none;');

// Get restart button
let restart = document.getElementById('restart');

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// Get the star rating element
let stars = document.getElementById('rating');
let finalStars = document.getElementById('stars');
let star2 = document.getElementsByClassName('star-2')[0];
let star3 = document.getElementsByClassName('star-3')[0];

// Variables for count up timer
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
setInterval(setTime, 1000);

// Adding arrays for matching pair generation
let memory_array = ['⇝','⇝','◎','◎','+','+','☀','☀','⇷','⇷','⊗','⊗','⚠','⚠','◈','◈'];
let memory_values = [];
let memory_card_ids = [];
let cards_flipped = 0;
let numTurns = 0;
let win = false;

// Function for incrementing the counter
function setTime() {
	if(!win) {
		++totalSeconds;
		secondsLabel.innerHTML = pad(totalSeconds % 60);
		minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
		if((minutesLabel.innerHTML == 0 && secondsLabel.innerHTML > 30 && !(star3.classList.contains('hidden'))) || ((counter.innerHTML > 15) && !(star3.classList.contains('hidden')))) {
			star3.classList.toggle('hidden');
		}
		else if((minutesLabel.innerHTML == 0 && secondsLabel.innerHTML > 50 && !(star2.classList.contains('hidden'))) || ((counter.innerHTML > 20) && !(star2.classList.contains('hidden')))) {
			star2.classList.toggle('hidden');
		}
	} else {

	}
}

function pad(val) {
	var valString = val + "";
	if (valString.length < 2) {
		return "0" + valString;
	} else {
		return valString;
	}
}

// Adding array shuffle method for rearranging matching cards
function memory_card_shuffle(array) {
	var currentIndex = array.length, randomIndex, tempValue;
	while(--currentIndex>0) {
		randomIndex = Math.floor(Math.random() * (currentIndex+1));
		tempValue = array[randomIndex];
		array[randomIndex] = array[currentIndex];
		array[currentIndex] = tempValue;
	}
	return array;
}

// Function that responds to the clicking of the table
function respondToClick(evt) {
	console.log(evt.target.parentElement);
	if(evt.target.id != 'matching-game' && (evt.target.parentElement.classList.contains('flipped') || evt.target.parentElement.classList.contains('flip')) != true) {
		let winner = false;
		winner = memoryGame(evt.target.parentElement.id, evt.target.parentElement.textContent);
		if(winner === true) {
		}
		//evt.target.classList.add('visibleFont');
		console.log(evt.target.parentElement.id + ' ' + evt.target.parentElement.textContent);
	}
}

// Function used to generate a new game board
function newGame() {
	cards_flipped = 0;
	memory_values = [];
	memory_card_ids = [];
	numTurns = 0;
	totalSeconds = 0;
	star2.classList.remove('hidden');
	star3.classList.remove('hidden');
	win = false;
	secondsLabel.innerHTML = pad(totalSeconds % 60);
	minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
	counter.innerHTML = numTurns;
	var output = '';
	memory_array = memory_card_shuffle(memory_array);
	for (var i = 0; i < memory_array.length; i++) {
		if((i === 0) || ((i)%4 === 0)) {
			output += '<tr>';
		}
			output += '<td id="card-'+i+'"><div class="front"></div><div class="back">'+memory_array[i]+'</div></td>';
		if((i+1)%4 === 0) {
			output += '</tr>';
		}
	}
	board.innerHTML = output;
	board.addEventListener('click', respondToClick);
}

// Function for flipping incorrect cards
function flipIncorrectCards() {
	let card_1 = document.getElementById(memory_card_ids[0]);
	let card_2 = document.getElementById(memory_card_ids[1]);

	// Stylistic changes to cards
	card_1.classList.remove('flip');
	card_2.classList.remove('flip');

	// Remove incorrect card tag
	card_1.querySelector('.back').classList.remove('incorrect');
	card_2.querySelector('.back').classList.remove('incorrect');
	
	// Clear both value and ids array
	memory_values = [];
	memory_card_ids = [];
}

// Function for flipping correct cards
function correctCards(card_1, card_2) {
	card_1.classList.add('flipped');
	card_2.classList.add('flipped');

	//Play correct cards animation
	card_1.querySelector('.back').classList.add('correct');
	card_2.querySelector('.back').classList.add('correct');
}

function cardFlip(card) {
	card.classList.add('flip');
}

function winner() {
	modal.getElementsByClassName('count')[0].innerHTML = numTurns;
	modal.getElementsByClassName('time')[0].innerHTML = timer.innerHTML;
	win = true;
	finalStars.innerHTML = stars.innerHTML;
	modal.style.display = "block";
}

// Function for game operation
function memoryGame(cardID, value) {
	let card = document.getElementById(cardID);
	if(memory_values.length < 2) {
		// Flips the selected card
		cardFlip(card);
		if(memory_values.length === 0) {
			// First card flipped in pair is stored in arrays
			memory_values.push(value);
			memory_card_ids.push(card.id);
		} else if(memory_values.length === 1) {
			// Second card flipped in pair is stored in arrays
			memory_values.push(value);
			memory_card_ids.push(card.id);
			numTurns += 1;
			counter.innerHTML = numTurns;
			let card_1 = document.getElementById(memory_card_ids[0]);
			let card_2 = document.getElementById(memory_card_ids[1]);
			// If statement to check if cards match
			if(memory_values[0] === memory_values[1]) {
				cards_flipped += 2;
				correctCards(card_1, card_2);
				memory_values = [];
				memory_card_ids = [];
				if(cards_flipped === memory_array.length) {
					//Print out end of game results
					setTimeout(winner, 400);
					return true;
				} 
			} else {
				// Cards were not a match and need to be flipped back over
				card_1.querySelector('.back').classList.add('incorrect');
				card_2.querySelector('.back').classList.add('incorrect');
				setTimeout(flipIncorrectCards, 1000);
				return false;
			}
		}
	}
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

restart.onclick = function() {
	modal.style.display = "none";
	newGame();
}

// Game event listeners
window.addEventListener('load', newGame);
refresh.addEventListener('click', newGame);

