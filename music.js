let card = document.getElementsByClassName("card");
let cards = [...card];
//console.log(cards);

//adds class normal at the start of running
// for(let i = 0; i< cards.length; i++)
// {
// 	cards[i].classList.toggle("normal");
// }

// deck of all cards in game
const deck = document.getElementById("card-deck");

//SHUFFLE MIGRATED
 // array for opened cards
let openedCards = [];

// @description shuffles cards
// @param {array}
// @returns shuffledarray
function shuffle(array) {
    let currentIndex = array.length
	let temporaryValue = currentIndex;
	let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

//THIS ONLY SHUFFLES THE ARRAY, NOT THE ACTUAL ELEMENTS
cards = shuffle(cards);


//SHUFFLES THE TAGS AFTER SHUFFLING THE ARRAY, RECONSTRUCTS OFF OF THE ARRAY
for (var i = 0; i < cards.length; i++){
	//first clears the entire html inside of the deck
	deck.innerHTML = "";
	cards.forEach(item => deck.appendChild(item));

	//cards[i].classList.remove("show", "open", "match", "disabled");
}


//playAudio migrated
//we pass in the element tag and find the ID to find the corresponding audio and play the soundbit
function playAudio(tag){

	// var target = tag.target.parentNode();
	console.log(tag);
	//not migrated
	applyPressedState(tag);
	
	//we target the id of the passed tag and put it in a variable.
	const passedTag = tag.id;
	//using the passed tag, we can target the audio using query selectors
	const audio = document.querySelector(`audio[data-sound="${passedTag}"]`);
	audio.play();
}

//applypressed migrated
function applyPressedState(tag){
	tag.closest("li").classList.toggle("pressed");
	
}


function cardOpen() {
	openedCards.push(this);
	if (openedCards.length === 2) {
	//	moveCounter();
		if (openedCards[0].type === openedCards[1].type) {
			matched();
		} else {
			unmatched();
		}
	}
}



function matched() {
	openedCards[0].classList.add("match", "disabled");
	openedCards[1].classList.add("match", "disabled");
	openedCards[0].classList.remove("show", "open", "no-event");
	openedCards[1].classList.remove("show", "open", "no-event");
	openedCards = [];
}

function unmatched(){
	openedCards[0].classList.add("unmatched");
	openedCards[1].classList.add("unmatched");
	disable();
	setTimeout(function () {
		openedCards[0].classList.remove("show", "open", "no-event", "unmatched");
		openedCards[1].classList.remove("show", "open", "no-event", "unmatched");
		enable();
		openedCards = [];
	}, 1100);
}


//console.log(cards);

//window.addEventListener('click', playAudio);





for (var i = 0; i < cards.length; i++) {
	card = cards[i];
	card.addEventListener("click", cardOpen);
};