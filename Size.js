class Size{
    static cardWidth(){return 100;}
    static cardHeight(){return 200;}
    static cardHeightTop(){return Size.cardHeight()/5;}
    static cardWidthLeftSeg(){return Size.cardWidth() * 0.1953;}
    static rightCardPadding(){return 10;}
    static upperBoardHeight(){return 250;}
    static ySlot(index){
        var map = [0, 110, 220, 330, 440, 550, 660];
        return map[index];
    }
    static boardWidth(){
        return Size.ySlot(6) + Size.cardWidth() + Size.rightCardPadding();
    }

    static boardHeight(){
        return Size.upperBoardHeight() + (12 * Size.cardHeightTop()) + Size.cardHeight() + 25;
    }
}
