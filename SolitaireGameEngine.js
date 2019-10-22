class SolitaireGameEngine {
    constructor(){
        this.deck = new Deck();
        this.reset();
    }

    reset(){
        this.deck.reset();
        setBackGround();
        this.buildLowerBoard();
        this.cardBank = [[],[],[],[]];
        this.drawStack = [null, null, null];
        this.drawableCards = this.deck.drawMulti(24);
        this.undrawableCards = [];
    }


    buildLowerBoard(){
        var cards = this.deck.getCardsByDisplayStatus(0);
        buildLowerBoard(cards);
        cards = this.deck.getCardsByDisplayStatus(2);
        buildLowerBoard(cards);
    }


    draw(){
        if (this.drawableCards.length == 0){
            for (var card of this.undrawableCards){
                this.drawableCards.push(card);
            }
            this.undrawableCards = [];
        }
        for (var drawSlot = 2;drawSlot > 0; drawSlot--){
            this.undrawableCards.push(this.drawStack[drawSlot]);
            if (this.drawableCards.length > 0){
                this.drawStack[drawSlot] = this.drawableCards.pop();
            } else {
                this.drawStack[drawSlot] = null;
            }
        }
    }

}
