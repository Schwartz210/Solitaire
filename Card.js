class Card {
    constructor(rank, suit, id, imageName){
        this.rank = rank;
        this.suit = suit;
        this.id = id;
        this.displayStatus = -1;
        this.imageName = imageName;
        this.upCard = null;
        this.downCard = null;
        this.coord = [-1, -1];
        this.bottomRightCoord = [-1, -1];
        this.divClassName = null;
    }

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
        this.cardsLower = [];
        this.reset();
    }

    reset(){
        this.availableCards = this.cards.slice(0);
        this.unavailableCards = [];
        this.shuffle();
        this.setLowerBoard();
    }

    createCards(){
        var cards = [];
        var card;
        var imageNum = 1;
        var imageName;
        var suitMap = {'Clubs': 'c', 'Spades': 's', 'Hearts':'h', 'Diamonds':'d'};
        var rankMap = {'A':'01','K':'13','Q':'12','J':'11','10':'10','9':'09','8':'08','7':'07','6':'06','5':'05','4':'04','3':'03','2':'02'};
        for (var rank of ['A','K','Q','J','10','9','8','7','6','5','4','3','2']){
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

    setLowerBoard(){
        this.cardsLower = this.drawMulti(28);
        this.cardsLower = assignLowerCoordinates(this.cardsLower);
        for (var card of this.cardsLower){
            card.setBottomRightCoord();
        }
    }

    getCardsByDisplayStatus(displayStatus, excludedId){
        var cards = [];
        for (var card of this.cardsLower){
            if (card.displayStatus == displayStatus && card.id != excludedId){
                cards.push(card);
            }
        }
        return cards;
    }
}
