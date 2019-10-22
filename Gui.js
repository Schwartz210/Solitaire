var currentlyDragging = false;
var draggingStack = false;

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
    } else if (card.displayStatus == 3){
        img.height = Size.cardHeight();
    }
    return img;
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
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

    function closeDragElement() {
        if (draggingStack){
            draggingStack = false;
            var dragImageIdToCardId;
            var dragContainerId;
            while (elmnt.childElementCount > 1){
                if (elmnt.lastElementChild.id != null){
                    dragImageIdToCardId = IDConverter.dragImageIdToCardId(elmnt.lastElementChild.id);
                    dragContainerId = IDConverter.cardToContainer(dragImageIdToCardId);
                    console.log(dragImageIdToCardId);
                    document.getElementById(dragContainerId).style.visibility = 'visable';
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
                    targetCard.displayStatus = 3;
                    document.getElementById('card' + targetCard.id).src = targetCard.getImageFile();
                    document.getElementById('card' + targetCard.id).height = Size.cardHeightTop();
                    movingCard.coord[0] = targetCard.coord[0];
                    movingCard.coord[1] = targetCard.coord[1] + Size.cardHeightTop();
                    elmnt.style.left = movingCard.coord[0] + 'px';
                    elmnt.style.top = movingCard.coord[1] + 'px';
                    targetCard.otherCard = movingCard;
                    return;
                }
            }
        }
        elmnt.style.left = movingCard.coord[0] + 'px';
        elmnt.style.top = movingCard.coord[1] + 'px';

    }


}
