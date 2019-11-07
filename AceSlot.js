class AceSlot {
    constructor(){
        this.slotMap = {'Clubs': null, 'Spades': null, 'Hearts': null, 'Diamonds': null}
        this.slotCardCount = {330: 0, 440: 0, 550: 0, 660: 0};
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
            card.upCard.setDisplayStatus(Card.DISPLAY_FULL_FRONT());
        }
        var slot = this.isAceSlot(mouseX, mouseY);
        card.coord[0] = slot;
        card.coord[1] = 0;
        var containerId = IDConverter.cardToContainer(card.id);
        var container = document.getElementById(containerId);
        container.style.left = card.coord[0] + 'px';
        container.style.top = card.coord[1] + 'px';
        if (allFountainCards.has(card)){
            allFountainCards.delete(card);
            delete fDisplayed[0];
            console.log(fDisplayed);
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
            cardBelow.setDisplayStatus(Card.DISPLAY_HIDDEN());
        }
        this.slotCardCount[slot] += 1;

    }
}
