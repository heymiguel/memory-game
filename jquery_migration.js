const app = {
    card: document.getElementsByClassName("card"),
};

const build = {
    cards: [...app.card],
    deck: $("#card-deck")[0],
    openedCards: [],
    matchedCards: []
}



//THIS ONLY SHUFFLES THE ARRAY, NOT THE ACTUAL ELEMENTS
app.shuffle = function(array){
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

app.htmlFix = function(){
    //SHUFFLES THE TAGS AFTER SHUFFLING THE ARRAY, RECONSTRUCTS OFF OF THE ARRAY
    for (let i = 0; i < build.cards.length; i++) {
        //first clears the entire html inside of the deck
        build.deck.innerHTML = "";
        build.cards.forEach(item => build.deck.append(item));
        build.cards[i].classList.remove("pressed", "match", "disabled");
 
    }
}

let second = 0, minute = 0, hour = 0;
let timer = document.querySelector(".timer");
let interval;

function startTimer() {
    interval = setInterval(function () {
        timer.innerHTML = minute+"mins " + second + "secs";
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

function startGame() {
    //clear cards for reset
    app.shuffle(build.cards);
    app.htmlFix();
    second = 0, minute = 0, hour = 0;
    clearInterval(interval);    
    let timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    startTimer();
    build.matchedCards = [];


}



$(function() {

    //THIS ONLY SHUFFLES THE ARRAY, NOT THE ACTUAL ELEMENTS
    build.cards = app.shuffle(build.cards);

    app.htmlFix();
    //first, empty the deck array and add elements back into it.
    //shuffle the deck, and then using the array, append those elements back into the HTML. change all the states to remove all active and disabled states.
    //reset everything

    second = 0;
    minute = 0;
    hour = 0;
    let timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    console.log(timer);
    clearInterval(interval);
    startTimer();
    console.log(interval);


    

    //on card click event listener, (should probably flip here as well)
    $('.card div').on('click', function(e){
        const sound = $(this).children('#audio')[0];
        if(!audio) return;

        sound.currentTime = 0;
        sound.play();
        applyPressedState($(this));
    });


    function applyPressedState(tag){
        $(tag).parent().toggleClass("pressed");
    }


    function cardOpen(){
        build.openedCards.push(this);
        console.log(second);

        if (build.openedCards.length === 2){
            if (build.openedCards[0].type === build.openedCards[1].type){
                matched();
                checkForWin();
            }
            else{
                unmatched();
            }
            //regardless of match, the array for openedCards needs to reset to empty
        }
        else if (build.openedCards.length === 1){
            build.openedCards[0].classList.add("disabled");
        }
        //what to do when the array passes length 3?
        //pop array twice then compare?
        else{
            console.log(build.openedCards);
            
            build.openedCards[0].classList.remove("pressed");
            build.openedCards[1].classList.remove("pressed");
        }
    }

    function checkForWin(){
        if (build.matchedCards.length == 16) {
            clearInterval(interval);
            // finalTime = timer.innerHTML;
            // .let timer = document.querySelector(".timer");
            // let finishTime = document.querySelector("#finish-time");

            document.getElementById("finish-time").innerHTML = `Congrats on clear! Your time is: ${timer.innerHTML}`;
            // $('#finish-time').innerHTML = timer;
            // finishTime.innerHTML = timer;


            $('#congrats').animate({ top: '30%' }, 350);
            $('#pa-button').on("click", function(e){
                $('#congrats').animate({ top: '100%' }, 350);
                startGame();
            });

            
        };
    }

    function matched(){
        // console.log(build.);
        build.openedCards[0].classList.add("match", "disabled");
        build.openedCards[1].classList.add("match", "disabled");
        build.openedCards = [];
        build.matchedCards.push(build.openedCards[0], build.openedCards[1]);
    }

    function unmatched(){
        build.openedCards[0].classList.add("unmatched");
        build.openedCards[1].classList.add("unmatched");
        build.openedCards = [];
    }


    function removeTransition(e) {
        if (e.propertyName !== 'opacity') return;
        e.target.classList.remove("pressed", "unmatched", "disabled");
    }

    const keys = document.querySelectorAll('.card');
    console.log(keys);
    keys.forEach(key => key.addEventListener('transitionend', removeTransition));    



    
    $('.card--playButton').on("click", function(){
        $("#main-screen").animate({ width: 'toggle' }, 350);            //complete
        $("#game-screen").animate({left: '0' }, 350);
    });


    for (let i = 0; i < build.cards.length; i++) {
        app.card = build.cards[i];
        app.card.addEventListener("click", cardOpen);
    };

    
});