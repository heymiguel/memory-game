const app = {
    card: document.getElementsByClassName("card"),
};


const build = {
    cards: [...app.card],
    deck: $("#card-deck")[0],
    openedCards: [], //array for openedCards, the max length here is preferably 2. any more that gets pushed in will pop the first two most likely indicating a mismatch
    matchedCards: []//array of matched cards. 16=finished
}



//THIS ONLY SHUFFLES THE ARRAY, NOT THE ACTUAL ELEMENTS
app.shuffle = function (array) {
    let currentIndex = array.length;
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
}


//SHUFFLES THE TAGS AFTER SHUFFLING THE ARRAY, RECONSTRUCTS OFF OF THE ARRAY
app.htmlFix = function () {
    for (let i = 0; i < build.cards.length; i++) {
        //first clears the entire html inside of the deck
        build.deck.innerHTML = "";
        build.cards.forEach(item => build.deck.append(item));
        build.cards[i].classList.remove("pressed", "match", "disabled");

    }
}

let second = 0, minute = 0;
let timer = document.querySelector(".timer");
let interval;

app.startTimer = function () {
    interval = setInterval(function () {
        timer.innerHTML = minute + "mins " + second + "secs";
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
    }, 1000);
}

//for restarts
app.startGame = function () {
    //clear cards for reset
    app.shuffle(build.cards);
    app.htmlFix();
    second = 0, minute = 0;
    clearInterval(interval);
    let timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    app.startTimer();
    build.matchedCards = [];
}




//toggles the pressed class for clicked buttons
app.applyPressedState = function (tag) {
    $(tag).parent().toggleClass("pressed");
}

//deals with "opening cards"
app.cardOpen = function () {
    build.openedCards.push(this); //pushes the opened card into array for tracking
    //if two cards are opened then.. 
    if (build.openedCards.length === 2) {
        //compare the type.if they are equal, then match and checkForWin, if not, return the two cards to normal state.

        if (build.openedCards[0].type === build.openedCards[1].type) {
            app.matched();
            app.checkForWin();
        }
        else {
            app.unmatched();
        }
        //regardless of match, the array for openedCards needs to reset to empty
    }
    //if there is only one card open, then disable it so it can't be played again to trigger unwanted states.
    else if (build.openedCards.length === 1) {
        build.openedCards[0].classList.add("disabled");
    }
    else {
        //otherwise, we remove the pressed state... this is more of a safety measure covering possible issues with spam clicks resulting in 3 or more opened cards and would remove the first two elements if that were the case. I personally do not think this is 100% functional.
        build.openedCards[0].classList.remove("pressed");
        build.openedCards[1].classList.remove("pressed");
    }
}


//this function is called after every matched pair. once the number of cards that are matched is 16, then there will be a div that rolls in via animation telling the user the clear time.
app.checkForWin = function () {
    if (build.matchedCards.length == 16) {
        clearInterval(interval); //needs to be here to stop the clock
        document.getElementById("finish-time").innerHTML = `Congrats on clear! Your time is: ${timer.innerHTML}`;

        //congrats div animation
        $('#congrats').animate({ top: '30%' }, 350);
        //event handler on the button located on the congrats div. Essentially play again button.
        $('#pa-button').on("click", function (e) {
            $('#congrats').animate({ top: '100%' }, 350);
            app.startGame();
        });
    };
}

//function that handles the case where a match is found.
app.matched = function () {
    build.openedCards[0].classList.add("match", "disabled");
    build.openedCards[1].classList.add("match", "disabled");
    build.openedCards = [];
    build.matchedCards.push(build.openedCards[0], build.openedCards[1]);
}

//function that handles the case where a match is not found
app.unmatched = function () {
    build.openedCards[0].classList.add("unmatched");
    build.openedCards[1].classList.add("unmatched");
    build.openedCards = [];
}



//wesbos 1a: technique from wesbos where it detects the opacity transition (though I used opacity 1 and 0.99 to essentially fake the effect) and removes all states. This solved a lot of wonky click event issues where some of my buttons stayed on a pressed state.
app.removeTransition = function (e) {
    if (e.propertyName !== 'opacity') return;
    e.target.classList.remove("pressed", "unmatched", "disabled");
}

$(function () {

    //THIS ONLY SHUFFLES THE ARRAY, NOT THE ACTUAL ELEMENTS
    build.cards = app.shuffle(build.cards);

    app.htmlFix();
    //first, empty the deck array and add elements back into it.
    //shuffle the deck, and then using the array, append those elements back into the HTML. change all the states to remove all active and disabled states.
    //reset everything

    //on card click event listener, (should probably flip here as well)
    $('.card div').on('click', function (e) {
        const sound = $(this).children('#audio')[0];
        if (!audio) return;

        sound.currentTime = 0;
        sound.play();
        app.applyPressedState($(this));
    });


    //wesbos 1b, listens for the end of transitions on all cards (faked it)
    const keys = document.querySelectorAll('.card');
    keys.forEach(key => key.addEventListener('transitionend', app.removeTransition));



    //little animation on play click to slide in the game screen and slide out the main screen also starts the timer
    $('.card--playButton').on("click", function () {
        $("#main-screen").animate({ width: 'toggle' }, 350);
        $("#game-screen").animate({ left: '0' }, 350);
        app.startTimer();
    });

    //add a click event listener to every single card
    for (let i = 0; i < build.cards.length; i++) {
        app.card = build.cards[i];
        app.card.addEventListener("click", app.cardOpen);
    };


});