var currentlyDragging = false;
var draggingStack = false;
var slotTracker = new SlotTracker();

function setBackGround(){}

function assignLowerCoordinates(cards){
    var i = 0;
    var x = 0;
    var y = 0;
    for (var rowCount=1;rowCount <= 7;rowCount++){
        for (var colCount=rowCount;colCount < 7;colCount++){
            x = colCount * (Size.cardWidth() + Size.rightCardPadding());
            cards[i].coord[0] = x;
            cards[i].coord[1] = y;
            cards[i].displayStatus = 0;
            cards[i].divClassName = 'cardholderNonMoveable';
            i++;
        }
        y += Size.cardHeight() / 5;
    }
    x = 0;
    y = 0;
    for (var j=0;j<7;j++){
        cards[i].coord[0] = x;
        cards[i].coord[1] = y;
        cards[i].displayStatus = 2;
        cards[i].divClassName = 'cardholderMoveable';
        i++;
        x += Size.cardWidth() + Size.rightCardPadding();
        y += Size.cardHeight() / 5;
    }
    return cards
}

function buildLowerBoard(cards){
    for (var card of cards){
        placeOneCard(card);
    }
}

function placeOneCard(card){
    var container = document.createElement("div");
    container.className = card.divClassName;
    container.style.top = card.coord[1] + "px";
    container.style.left = card.coord[0] + 'px';
    container.id = IDConverter.cardToContainer(card.id);
    if (card.divClassName == 'cardholderMoveable'){
        dragElement(container);
    }
    var image = new Image();
    image.width = Size.cardWidth();
    image.height = card.getHeight();
    image.src = card.getImageFile();
    image.id = IDConverter.cardToImage(card.id);
    container.appendChild(image);
    document.getElementById('body').appendChild(container);
}

function getImage(card){
    var img = new Image();
    img.src = card.getImageFile();
    img.width = Size.cardWidth();
    img.id = 'drag' + card.id;
    if (card.displayStatus == 3){
        img.height = Size.cardHeightTop();
    } else if (card.displayStatus == 2){
        img.height = Size.cardHeight();
    }
    return img;
}

function stackCard(element, targetCard, movingCard){
    slotTracker.alter(movingCard.coord[0], '-');
    if (targetCard != null){
        slotTracker.alter(targetCard.coord[0], '+');
        targetCard.displayStatus = 3;  //shows just top
        document.getElementById('card' + targetCard.id).src = targetCard.getImageFile();
        document.getElementById('card' + targetCard.id).height = Size.cardHeightTop();
        var targetCardDiv = document.getElementById(IDConverter.cardToContainer(targetCard.id));
        targetCardDiv.height = Size.cardHeightTop();
        targetCardDiv.style.left = targetCard.coord[0] + 'px';
        targetCardDiv.style.top = targetCard.coord[1] + 'px';
        targetCard.setBottomRightCoord();
        targetCard.otherCard = movingCard;
        movingCard.coord[0] = targetCard.coord[0];
        movingCard.coord[1] = targetCard.coord[1] + Size.cardHeightTop();
    } else {
        var mouseX = parseInt(String(element.style.left).replace('px',''));
        movingCard.coord[0] = slotTracker.getSlot(mouseX);
        movingCard.coord[1] = 0;
    }
    movingCard.setBottomRightCoord();
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
        cardToShow.displayStatus = 1;
        revealCard(cardToShow);
        cardToShow.setBottomRightCoord();
        var image = document.getElementById(IDConverter.cardToImage(cardToShow.id));
        image.src = cardToShow.getImageFile();
        image.height = Size.cardHeight();
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
            if (card.otherCard != null){
                draggingStack = true;
                var tempCard = card.otherCard;
                while (tempCard != null){
                    elmnt.appendChild(document.createElement('br'));
                    elmnt.appendChild(getImage(tempCard));
                    document.getElementById(IDConverter.cardToContainer(tempCard.id)).style.visibility = 'hidden';
                    tempCard = tempCard.otherCard;
                }
            } else {
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
        var movingCardId = IDConverter.containerToCard(elmnt.id);
        var movingCard = gameEngine.deck.cardMap.get(movingCardId);
        for (var targetCard of gameEngine.deck.getCardsByDisplayStatus(2, movingCardId)){
            if (targetCard.collision(pos3, pos4)){
                if (movingCard.canStack(targetCard)){
                    displayFullBackOfLowestCoveredCard(movingCard.coord[0]);
                    moveStack(movingCard, targetCard);
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
        movingCard.coord[1] = 0;
        cardOrder = [movingCard];
    }

    while (movingCard.otherCard != null){
        cardOrder.push(movingCard.otherCard);
        movingCard = movingCard.otherCard;
    }
    for (var i=0;i<cardOrder.length-1;i++){
        targetCard = cardOrder[i];
        movingCard = cardOrder[i+1];
        stackCard(document.getElementById(IDConverter.cardToContainer(movingCard.id)), targetCard, movingCard);
    }
}

function revealCard(card){
    var imageId = IDConverter.cardToImage(card.id);
    var image = document.getElementById(imageId);
    var containerId = IDConverter.cardToContainer(card.id);
    var container = document.getElementById(containerId);
    image.onclick = function(){
        card.displayStatus = 2;
        image.src = card.getImageFile();
        card.divClassName = 'cardholderMoveable';
        dragElement(container);
        container.className = 'cardholderMoveable';
    }
}
