const app = {
    card: document.getElementsByClassName("card"),
    // cards: [...app.card]

};

const build = {
    cards: [...app.card],
    deck: $("#card-deck")[0],
    openedCards: []
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
        console.log(build.cards[i]);
        //cards[i].classList.remove("show", "open", "match", "disabled");
    }
}




$(function() {
    // let card = document.getElementsByClassName("card");
    // let cards = [...app.card];

    // const deck = $("#card-deck")[0];

//    let openedCards = [];

    // function shuffle(array) {
        
    // }

    //THIS ONLY SHUFFLES THE ARRAY, NOT THE ACTUAL ELEMENTS
    build.cards = app.shuffle(build.cards);

    app.htmlFix();

    
    

    //on card click event listener, (should probably flip here as well)
    $('.card div').on('click', function(e){
        const sound = $(this).children('#audio')[0];
        sound.play();
        applyPressedState($(this));
        // checkForMatch();        
    });


    function applyPressedState(tag){
        $(tag).parent().toggleClass("pressed");
    }


    function cardOpen(){
        build.openedCards.push(this);

        if (build.openedCards.length === 2){
            console.log(build.openedCards[0].closest('div'));

            if (build.openedCards[0].type === build.openedCards[1].type){
                console.log("reached");
                matched();
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
            
        }
    }

    function matched(){
        build.openedCards[0].classList.add("match", "disabled");
        build.openedCards[1].classList.add("match", "disabled");
        build.openedCards = [];
    }

    function unmatched(){
        build.openedCards[0].classList.add("unmatched");
        build.openedCards[1].classList.add("unmatched");
        build.openedCards[0].classList.add("disabled");
        build.openedCards[1].classList.add("disabled");
        // build.openedCards = [];
        setTimeout(function () {
            build.openedCards[0].classList.remove("pressed", "unmatched", "disabled");
            build.openedCards[1].classList.remove("pressed", "unmatched", "disabled");
            build.openedCards = [];
            
        }, 2000);
        
    }

    




    for (let i = 0; i < build.cards.length; i++) {
        app.card = build.cards[i];
        app.card.addEventListener("click", cardOpen);
    };

    
});