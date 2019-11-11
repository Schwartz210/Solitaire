var fAvailable = [];
var fDisplayed = [];
var fUnavailable = [];
var allFountainCards = new Set();
var fSlots = [Size.ySlot(1), Size.ySlot(1)+Size.cardWidthLeftSeg(), Size.ySlot(1)+Size.cardWidthLeftSeg()*2]

function fReset(cards){
    fAvailable = cards;
    for (var card of cards){
        card.setDisplayStatus(Card.DISPLAY_HIDDEN(), 'fReset');
        allFountainCards.add(card);
    }
}

function displayFountainCards(){
    fDisplayed[0].moveTo(fSlots[2], 0);
    fDisplayed[0].setDisplayStatus(Card.DISPLAY_FULL_FRONT(), 'displayFountainCards');
    if (fDisplayed[1] != null){
        fDisplayed[1].moveTo(fSlots[1], 0);
        fDisplayed[1].setDisplayStatus(Card.DISPLAY_LEFT(), 'displayFountainCards');
    }
    if (fDisplayed[2] != null){
        fDisplayed[2].moveTo(fSlots[0], 0);
        fDisplayed[2].setDisplayStatus(Card.DISPLAY_LEFT(), 'displayFountainCards');
    }
}

function resetAvailable(){
    var tempList = [];
    var temp;
    while (fDisplayed.length > 0){
        temp = fDisplayed.pop();
        temp.setDisplayStatus(Card.DISPLAY_HIDDEN(), 'resetAvailable');
        tempList.push(temp);
    }
    while (fUnavailable.length > 0){
        tempList.push(fUnavailable.pop());
    }
    while (tempList.length > 0){
        fAvailable.push(tempList.pop());
    }
    document.getElementById('fountain').src = 'Art/back.png';
    cardLinks();
}

function cardLinks(){

    for (var card of fUnavailable){
        card.upCard = null;
    }
    for (var i=0;i<fDisplayed.length-1;i++){
        fDisplayed[i].upCard = fDisplayed[i+1];
    }

}


function fOnclick(){
    var temp;
    if (fAvailable.length == 0){
        resetAvailable();
        return;
    }
    while (fDisplayed.length > 0){
        temp = fDisplayed.pop();
        temp.setDisplayStatus(Card.DISPLAY_HIDDEN(), 'fOnclick');
        fUnavailable.push(temp);
    }
    for (var i=0;i<3;i++){
        if (fAvailable.length > 0){
            fDisplayed.push(fAvailable.pop());
        }
    }
    cardLinks();
    displayFountainCards();
    if (fAvailable.length == 0){
        document.getElementById('fountain').src = 'Art/emptyfountain.png';
    }
}
