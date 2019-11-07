class Card {
    constructor(rank, suit, id, imageName){
        this.rank = rank;
        this.suit = suit;
        this.id = id;
        this.displayStatus = -1;
        this.imageName = imageName;
        this.currentImage = null;
        this.upCard = null;
        this.downCard = null;
        this.coord = [-1, -1];
        this.bottomRightCoord = [-1, -1];
        this.divClassName = null;
        this.createVisualElements();
        this.setDisplayStatus(Card.DISPLAY_HIDDEN());
    }

    static DISPLAY_TOP_BACK(){return 0;}
    static DISPLAY_FULL_BACK(){return 1;}
    static DISPLAY_FULL_FRONT(){return 2;}
    static DISPLAY_TOP_FRONT(){return 3;}
    static DISPLAY_HIDDEN(){return 4;}
    static DISPLAY_LEFT(){return 5;}

    getColor(){
        if (this.suit == 'Hearts' || this.suit == 'Diamonds'){
            return 'red';
        } else {
            return 'black';
        }
    }

    toString(){
        return this.rank + " of " + this.suit;
    }

    createVisualElements(){
        this.image = new Image();
        this.container = document.createElement('div');
        this.container.className = this.divClassName;
        this.container.id = IDConverter.cardToContainer(this.id);
        this.image.id = IDConverter.cardToImage(this.id);
        this.container.appendChild(this.image);
        document.getElementById('body').appendChild(this.container);
    }

    setDisplayStatus(status){
        switch (status) {
            case Card.DISPLAY_TOP_BACK():
                this.container.className = 'cardholderNonMoveable';
                this.image.src = 'Art/tops/back.png';
                this.image.width = Size.cardWidth();
                this.image.height = Size.cardHeightTop();
                break;
            case Card.DISPLAY_FULL_BACK():
                //this.divClassName = 'cardholderMoveable';
                this.container.className = 'cardholderMoveable';
                this.image.src = 'Art/back.png';
                this.image.height = Size.cardHeight();
                this.image.onclick = function(){
                    var cardId = IDConverter.imageToCard(this.id);
                    var card = gameEngine.deck.cardMap.get(cardId);
                    card.setDisplayStatus(2);
                };
                break;
            case Card.DISPLAY_FULL_FRONT():
                this.image.src = 'Art/' + this.imageName;
                this.image.width = Size.cardWidth();
                this.image.height = Size.cardHeight();
                //this.divClassName = 'cardholderMoveable';
                this.container.className = 'cardholderMoveable';
                dragElement(this.container);

                break;
            case Card.DISPLAY_TOP_FRONT():
                this.image.src = 'Art/tops/' + this.imageName;
                this.image.height = Size.cardHeightTop();
                break;
            case Card.DISPLAY_HIDDEN():
                this.container.style.left = Size.boardWidth();
                this.container.style.top = Size.boardHeight();
                this.container.className = 'hide';
                break;
            case Card.DISPLAY_LEFT():
                this.image.src = 'Art/left/' + this.imageName;
                this.image.height = Size.cardHeight();
                this.image.width = Size.cardWidthLeftSeg();
                this.container.className = 'cardholderNonMoveable';
                break;
            default:
                break;
        }
        this.displayStatus = status;
        this.setBottomRightCoord();
    }

    moveTo(x, y){
        this.coord = [x, y];
        this.container.style.left = x + 'px';
        this.container.style.top = y + 'px';
    }

    getImageFile(){
        if (this.displayStatus == 0){
            return 'Art/tops/back.png';
        } else if (this.displayStatus == 1){
            return 'Art/back.png';
        } else if (this.displayStatus == 2) {
            return 'Art/' + this.imageName;
        } else if (this.displayStatus == 3){
            return 'Art/tops/' + this.imageName;
        } else {
            return null;
        }
    }

    getHeight(){
        if (this.displayStatus == 0){
            return Size.cardHeightTop();
        } else {
            return Size.cardHeight();
        }
    }

    setBottomRightCoord(){
        this.bottomRightCoord[0] = this.coord[0] + Size.cardWidth();
        this.bottomRightCoord[1] = this.coord[1] + this.getHeight();
    }

    collisionX(mouseX){
        if (mouseX < this.coord[0] || mouseX > this.bottomRightCoord[0]){
            return false;
        } else {
            return true;
        }
    }

    collisionY(mouseY){
        if (mouseY < this.coord[1] || mouseY > this.bottomRightCoord[1]){
            return false;
        } else {
            return true;
        }
    }

    collision(x, y){
        return this.collisionX(x) && this.collisionY(y);
    }

    canStack(targetCard){
        var rankMap = {'A':1,'K':13,'Q':12,'J':11,'10':10,'9':9,'8':8,'7': 7,'6':6,'5':5,'4':4,'3':3,'2':2};
        if (rankMap[targetCard.rank] != rankMap[this.rank] + 1){
            return false;
        } else if (targetCard.getColor() == this.getColor()){
            return false;
        } else {
            return true;
        }

    }
}

class Deck {
    constructor(){
        this.cardMap = new Map();
        this.cards = this.createCards();
    }

    static getRanks(){
        return ['A','2','3','4','5','6','7','8','9','10','J','Q', 'K'];
    }

    static getRankScore(rank){
        return Deck.getRanks().indexOf(rank)+1;
    }

    reset(){
        this.availableCards = this.cards.slice(0);
        this.unavailableCards = [];
        this.shuffle();
        this.fountainCards = this.drawMulti(24);
        this.cardsLowerReverse = this.drawMulti(21);
        this.cardsLowerFaceup = this.drawMulti(7);
        assignLowerCoordinates(this.cardsLowerReverse, this.cardsLowerFaceup);
    }

    createCards(){
        var cards = [];
        var card;
        var imageNum = 1;
        var imageName;
        var suitMap = {'Clubs': 'c', 'Spades': 's', 'Hearts':'h', 'Diamonds':'d'};
        var rankMap = {'A':'01','K':'13','Q':'12','J':'11','10':'10','9':'09','8':'08','7':'07','6':'06','5':'05','4':'04','3':'03','2':'02'};
        for (var rank of Deck.getRanks()){
            for (var suit of ['Clubs', 'Spades', 'Hearts', 'Diamonds']){
                imageName = suitMap[suit] + rankMap[rank];
                imageName += '.png';
                card = new Card(rank, suit, rank+'-'+suit, imageName);
                cards.push(card);
                this.cardMap.set(rank+'-'+suit, card);
                imageNum++;
            }
        }
        return cards;
    }

    shuffle(){
        var temp, index2;
        var index1 = -1;
        for (let i=0; i<300; i++) {
            index1++;
            if (index1 == this.availableCards.length){
                index1 = 0;
            }
            index2 = Math.floor(Math.random() * Math.floor(this.availableCards.length));
            temp = this.availableCards[index1];
            this.availableCards[index1] = this.availableCards[index2];
            this.availableCards[index2] = temp;
        }
    }

    draw(){
        if (this.availableCards.length > 0){
            var card = this.availableCards.pop();
            this.unavailableCards.push(card);
            return card;
        } else {
            return null;
        }
    }

    drawMulti(quantity){
        var cards = [];
        for (var i=0;i<quantity;i++){
            cards.push(this.draw());
        }
        return cards;
    }

    getCardsByDisplayStatus(displayStatus, excludedId){
        var cards = [];
        for (var card of this.cards){
            if (card.displayStatus == displayStatus && card.id != excludedId){
                cards.push(card);
            }
        }
        return cards;
    }
}
