class SolitaireGameEngine {
    constructor(){
        this.deck = new Deck();
        this.aceSlot = new AceSlot();
        this.reset();
    }

    reset(){
        this.deck.reset();
        setBackGround();
        this.buildLowerBoard();
        fReset(this.deck.fountainCards);

    }


    buildLowerBoard(){
        buildLowerBoard(this.deck.getCardsByDisplayStatus(Card.DISPLAY_TOP_BACK()));
        buildLowerBoard(this.deck.getCardsByDisplayStatus(Card.DISPLAY_FULL_FRONT()));
    }

}
