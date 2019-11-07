var fAvailable = [];
var fDisplayed = [];
var fUnavailable = [];
var allFountainCards = new Set();
var fSlots = [Size.ySlot(1), Size.ySlot(1)+Size.cardWidthLeftSeg(), Size.ySlot(1)+Size.cardWidthLeftSeg()*2]

function fReset(cards){
    fAvailable = cards;
    for (var card of cards){
        card.setDisplayStatus(Card.DISPLAY_HIDDEN());
        allFountainCards.add(card);
    }
    cardLinks();
}



function displayFountainCards(){
    fDisplayed[0].moveTo(fSlots[2], 0);
    fDisplayed[0].setDisplayStatus(Card.DISPLAY_FULL_FRONT());
    if (fDisplayed[1] != null){
        fDisplayed[1].moveTo(fSlots[1], 0);
        fDisplayed[1].setDisplayStatus(Card.DISPLAY_LEFT());
    }
    if (fDisplayed[2] != null){
        fDisplayed[2].moveTo(fSlots[0], 0);
        fDisplayed[2].setDisplayStatus(Card.DISPLAY_LEFT());
    }
}

function resetAvailable(){
    var tempList = [];
    var temp;
    while (fDisplayed.length > 0){
        temp = fDisplayed.pop();
        temp.setDisplayStatus(Card.DISPLAY_HIDDEN());
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
    for (var i=0;i<fAvailable.length-1;i++){
        fAvailable[i+1].upCard = fAvailable[i];
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
        temp.setDisplayStatus(Card.DISPLAY_HIDDEN());
        fUnavailable.push(temp);
    }
    for (var i=0;i<3;i++){
        if (fAvailable.length > 0){
            fDisplayed.push(fAvailable.pop());
        }
    }
    displayFountainCards();
    if (fAvailable.length == 0){
        document.getElementById('fountain').src = 'Art/emptyfountain.png';
    }
}
