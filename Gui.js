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
    image.width = Size.cardWidth();
    image.height = Size.cardHeight();
    image.src = 'Art/aceslot.png';
    var container = document.createElement("div");
    container.style.top = '0px';
    container.style.left = Size.ySlot(slotIndex) + 'px';
    container.style.position = 'fixed';
    container.style.zIndex = '-1';
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
            reverseCards[i].setDisplayStatus(Card.DISPLAY_TOP_BACK());
            i++;
        }
        y += Size.cardHeight() / 5;
    }
    x = 0;
    y = Size.upperBoardHeight();
    i = 0;
    for (var j=0;j<7;j++){
        faceupCards[i].moveTo(x, y);
        faceupCards[i].setDisplayStatus(Card.DISPLAY_FULL_FRONT());
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
    slotTracker.alter(movingCard.coord[0], '-');
    if (targetCard != null){
        slotTracker.alter(targetCard.coord[0], '+');
        targetCard.downCard = movingCard;
        movingCard.upCard = targetCard;
        movingCard.coord[0] = targetCard.coord[0];
        movingCard.coord[1] = targetCard.coord[1] + Size.cardHeightTop();
        movingCard.setDisplayStatus(Card.DISPLAY_FULL_FRONT());
        targetCard.setDisplayStatus(Card.DISPLAY_TOP_FRONT());
    } else {
        var mouseX = parseInt(String(element.style.left).replace('px',''));
        movingCard.coord[0] = slotTracker.getSlot(mouseX);
        movingCard.coord[1] = 0;
    }

    element.style.left = movingCard.coord[0] + 'px';
    element.style.top = movingCard.coord[1] + 'px';
}

function displayFullBackOfLowestCoveredCard(vacatedCardXAxis){
    var candidates = gameEngine.deck.getCardsByDisplayStatus(0, null);
    var cardToShow;
    var max = -1;
    for (var candidate of candidates){
        if (candidate.coord[0] == vacatedCardXAxis && candidate.coord[1] > max){
            max = candidate.coord[1];
            cardToShow = candidate;
        }
    }
    if (cardToShow != null){
        cardToShow.setDisplayStatus(Card.DISPLAY_FULL_BACK());
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
        if (gameEngine.aceSlot.isAceSlot(pos3, pos4) != null){
            if (gameEngine.aceSlot.canPlace(movingCard, pos3, pos4)){
                displayFullBackOfLowestCoveredCard(movingCard.coord[0]);
                gameEngine.aceSlot.place(movingCard, pos3, pos4);
                return;
            }
        }
        for (var targetCard of gameEngine.deck.getCardsByDisplayStatus(Card.DISPLAY_FULL_FRONT(), movingCardId)){
            if (targetCard.collision(pos3, pos4)){
                if (movingCard.canStack(targetCard)){
                    if (movingCard.upCard != null){
                        movingCard.upCard.setDisplayStatus(Card.DISPLAY_FULL_FRONT());
                    }
                    displayFullBackOfLowestCoveredCard(movingCard.coord[0]);
                    moveStack(movingCard, targetCard);
                    if (allFountainCards.has(movingCard)){
                        allFountainCards.delete(movingCard);
                        fDisplayed.splice(0,1);
                    }
                    return;
                }
            }
        }
        if (slotTracker.isEmptySlot(pos3) && movingCard.rank == 'K'){
            displayFullBackOfLowestCoveredCard(movingCard.coord[0]);
            moveStack(movingCard, null, elmnt);
        }
        elmnt.style.left = movingCard.coord[0] + 'px';
        elmnt.style.top = movingCard.coord[1] + 'px';
    }
}

function moveStack(movingCard, targetCard, element){
    var cardOrder;
    if (targetCard != null){
        cardOrder = [targetCard, movingCard];
    } else {
        var mouseX = parseInt(String(element.style.left).replace('px',''));
        movingCard.coord[0] = slotTracker.getSlot(mouseX);
        movingCard.coord[1] = Size.upperBoardHeight();
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
