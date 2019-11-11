var currentlyDragging = false;
var draggingStack = false;
var slotTracker = new SlotTracker();

function setBackGround(){
    var backgroundImage = new Image();
    backgroundImage.width = Size.boardWidth();
    backgroundImage.height = Size.boardHeight();
    backgroundImage.src = 'Art/background.png';
    var container = document.createElement("div");
    container.className = 'backgroundContainer'
    container.appendChild(backgroundImage);
    document.getElementById('body').appendChild(container);
    for (var i=3;i<7;i++){
        playAceSlot(i);
    }
    var fountainImage = new Image();
    fountainImage.width = Size.cardWidth();
    fountainImage.height = Size.cardHeight();
    fountainImage.id = 'fountain';
    fountainImage.src = 'Art/back.png';
    fountainImage.onclick = fOnclick;
    var fountainContainer = document.createElement('div');
    fountainContainer.appendChild(fountainImage);
    fountainContainer.style.left = Size.ySlot(0);
    fountainContainer.style.top = 0;
    fountainContainer.className = 'cardholderNonMoveable';
    document.getElementById('body').appendChild(fountainContainer);
}

function playAceSlot(slotIndex){
    var image = new Image();
    image.className = 'aceslot';
    image.src = 'Art/aceslot.png';
    var container = document.createElement("div");
    container.className = 'aceslot';
    container.style.left = Size.ySlot(slotIndex) + 'px';
    container.appendChild(image);
    document.getElementById('body').appendChild(container);
}

function assignLowerCoordinates(reverseCards, faceupCards){
    var i = 0;
    var x = 0;
    var y = Size.upperBoardHeight();
    for (var rowCount=1;rowCount <= 7;rowCount++){
        for (var colCount=rowCount;colCount < 7;colCount++){
            x = colCount * (Size.cardWidth() + Size.rightCardPadding());
            reverseCards[i].moveTo(x, y);
            reverseCards[i].setDisplayStatus(Card.DISPLAY_TOP_BACK(), 'assignLowerCoordinates');
            i++;
        }
        y += Size.cardHeight() / 5;
    }
    x = 0;
    y = Size.upperBoardHeight();
    i = 0;
    for (var j=0;j<7;j++){
        faceupCards[i].moveTo(x, y);
        faceupCards[i].setDisplayStatus(Card.DISPLAY_FULL_FRONT(), 'assignLowerCoordinates');
        i++;
        x += Size.cardWidth() + Size.rightCardPadding();
        y += Size.cardHeight() / 5;
    }
}

function getImage(card){
    var img = new Image();
    img.src = card.getImageFile();
    img.width = Size.cardWidth();
    img.id = 'drag' + card.id;
    if (card.displayStatus == Card.DISPLAY_TOP_FRONT()){
        img.height = Size.cardHeightTop();
    } else if (card.displayStatus == Card.DISPLAY_FULL_FRONT()){
        img.height = Size.cardHeight();
    }
    return img;
}

function stackCard(element, targetCard, movingCard){
    if (movingCard.upCard != null){
        movingCard.upCard.setDisplayStatus(Card.DISPLAY_FULL_FRONT());
    }
    if (targetCard != null){
        targetCard.downCard = movingCard;
        movingCard.upCard = targetCard;
        movingCard.moveTo(targetCard.coord[0], targetCard.coord[1] + Size.cardHeightTop());
        movingCard.setDisplayStatus(Card.DISPLAY_FULL_FRONT(), 'stackCard');
        targetCard.setDisplayStatus(Card.DISPLAY_TOP_FRONT(), 'stackCard');
    } else {
        var mouseX = parseInt(String(element.style.left).replace('px',''));
        movingCard.moveTo(slotTracker.getSlot(mouseX), 0);
    }
}

function moveStack(movingCard, targetCard, element){
    var cardOrder;
    if (targetCard != null){
        cardOrder = [targetCard, movingCard];
    } else {
        var mouseX = parseInt(String(element.style.left).replace('px',''));
        movingCard.moveTo(slotTracker.getSlot(mouseX), Size.upperBoardHeight());
        cardOrder = [movingCard];
    }

    while (movingCard.downCard != null){
        cardOrder.push(movingCard.downCard);
        movingCard = movingCard.downCard;
    }
    for (var i=0;i<cardOrder.length-1;i++){
        targetCard = cardOrder[i];
        movingCard = cardOrder[i+1];
        stackCard(document.getElementById(IDConverter.cardToContainer(movingCard.id)), targetCard, movingCard);
    }
}

function displayFullBackOfLowestCoveredCard(vacatedCardXAxis){
    var candidates = gameEngine.deck.getCardsByDisplayStatus(Card.DISPLAY_TOP_BACK(), null);
    var cardToShow;
    var max = Size.upperBoardHeight()-1;
    for (var candidate of candidates){
        if (candidate.coord[0] == vacatedCardXAxis && candidate.coord[1] > max){
            max = candidate.coord[1];
            cardToShow = candidate;
        }
    }
    if (cardToShow != null){
        cardToShow.setDisplayStatus(Card.DISPLAY_FULL_BACK(), 'displayFullBackOfLowestCoveredCard');
    }
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = drop;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        if (!currentlyDragging){
            currentlyDragging = true;
            var cardId = IDConverter.containerToCard(elmnt.id);
            var card = gameEngine.deck.cardMap.get(cardId);
            if (card.downCard != null){
                draggingStack = true;
                var tempCard = card.downCard;
                while (tempCard != null){
                    elmnt.appendChild(document.createElement('br'));
                    elmnt.appendChild(getImage(tempCard));
                    document.getElementById(IDConverter.cardToContainer(tempCard.id)).style.visibility = 'hidden';
                    tempCard = tempCard.downCard;
                }
            }
        }
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        elmnt.style.zIndex = "1";
    }

    function drop() {
        if (draggingStack){
            draggingStack = false;
            var dragImageIdToCardId;
            var dragContainerId;
            while (elmnt.childElementCount > 1){
                if (elmnt.lastElementChild.tagName != 'BR'){
                    dragImageIdToCardId = IDConverter.dragImageIdToCardId(elmnt.lastElementChild.id);
                    dragContainerId = IDConverter.cardToContainer(dragImageIdToCardId);
                    document.getElementById(dragContainerId).style.visibility = 'visible';
                }
                elmnt.removeChild(elmnt.lastElementChild);
            }
        }
        currentlyDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.style.zIndex = "0";
        var movingCardId = IDConverter.containerToCard(elmnt.id);
        var movingCard = gameEngine.deck.cardMap.get(movingCardId);
        var legalPlay = false;
        if (gameEngine.aceSlot.isAceSlot(pos3, pos4) != null){  //check if card is played in Ace Slot
            if (gameEngine.aceSlot.canPlace(movingCard, pos3, pos4)){
                if (movingCard.upCard == null){
                    displayFullBackOfLowestCoveredCard(movingCard.coord[0]);
                }
                gameEngine.aceSlot.place(movingCard, pos3, pos4);
                legalPlay = true;
            }
        } else if (slotTracker.isEmptySlot(pos3) && movingCard.rank == 'K'){  //check if card id King dropped into empty slot
            displayFullBackOfLowestCoveredCard(movingCard.coord[0]);
            moveStack(movingCard, null, elmnt);
            legalPlay = true;
        } else {
            for (var targetCard of gameEngine.deck.getCardsByDisplayStatus(Card.DISPLAY_FULL_FRONT(), movingCardId)){  //check for regular lower board play
                if (targetCard.collision(pos3, pos4)){
                    if (movingCard.canStack(targetCard)){
                        if (movingCard.upCard != null){
                            movingCard.upCard.setDisplayStatus(Card.DISPLAY_FULL_FRONT(), 'drop');
                        }
                        displayFullBackOfLowestCoveredCard(movingCard.coord[0]);
                        moveStack(movingCard, targetCard);

                        legalPlay = true;
                    }
                }
            }
        }
        if (!legalPlay){
            elmnt.style.left = movingCard.coord[0] + 'px';
            elmnt.style.top = movingCard.coord[1] + 'px';
        } else {
            if (allFountainCards.has(movingCard)){
                allFountainCards.delete(movingCard);
                fDisplayed.splice(0,1);
            }
        }
    }
}
