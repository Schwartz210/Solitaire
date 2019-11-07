class SolitaireGameEngine {
    constructor(){
        this.deck = new Deck();
        this.aceSlot = new AceSlot();
        this.reset();
    }

    reset(){
        setBackGround();
        this.deck.reset();
        fReset(this.deck.fountainCards);
    }
}
