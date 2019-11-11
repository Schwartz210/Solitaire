class AceSlot {
    constructor(){
        this.slotMap = {'Clubs': null, 'Spades': null, 'Hearts': null, 'Diamonds': null}
        this.slotCardCount = {330: 0, 440: 0, 550: 0, 660: 0};
        this.cardsInSlots= new Set();
    }

    isAceSlot(mouseX, mouseY){
        if (mouseY <= Size.cardHeight()){
            if (slotTracker.getSlot(mouseX) >= 330){
                return slotTracker.getSlot(mouseX);
            }
        }
        return null;
    }

    canPlaceAce(card, slot){
        if (card.rank == 'A' && this.slotCardCount[slot] == 0){
            return true;
        }
        return false;
    }

    canPlaceNonAce(card, slot){
        if (this.slotMap[card.suit] == slot){
            if (Deck.getRankScore(card.rank) == this.slotCardCount[slot] + 1){
                return true;
            }
        }
        return false;
    }

    canPlace(card, mouseX, mouseY){
        var slot = this.isAceSlot(mouseX, mouseY);
        if (this.canPlaceAce(card, slot)){
            return true;
        } else if (this.canPlaceNonAce(card, slot)){
            return true;
        }
        return false;
    }

    place(card, mouseX, mouseY){
        if (card.upCard != null){
            console.log('place');
            card.upCard.setDisplayStatus(Card.DISPLAY_FULL_FRONT(), 'place');
        }
        var slot = this.isAceSlot(mouseX, mouseY);
        card.moveTo(slot, 0);
        this.cardsInSlots.add(card);
        if (allFountainCards.has(card)){
            allFountainCards.delete(card);
            fDisplayed.splice(0, 1);
        }
        if (card.rank == 'A'){
            if (this.slotMap[card.suit] != null){
                this.slotCardCount[this.slotMap[card.suit]] = 0;
            }
            this.slotMap[card.suit] = slot;
        } else {
            var ranks = Deck.getRanks();
            var index = Deck.getRankScore(card.rank) - 2;
            var rank = ranks[index];
            var cardBelow = gameEngine.deck.cardMap.get(rank+'-'+card.suit);
            cardBelow.setDisplayStatus(Card.DISPLAY_HIDDEN(), 'place');
            card.upCard = cardBelow;
        }
        this.slotCardCount[slot] += 1;

    }
}
