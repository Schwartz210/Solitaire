class IDConverter {
    static cardToImage(cardId){
        return 'card' + cardId;
    }

    static imageToCard(imageId){
        return imageId.slice(4, imageId.length);
    }

    static cardToContainer(cardId){
        return 'div-' + cardId;
    }

    static containerToCard(containerId){
        return containerId.slice(4, containerId.length)
    }

    static imageToContainer(imageId){
        return imageId.replace('card', 'div-');
    }

    static dragImageIdToCardId(dragImageId){
        return dragImageId.replace('drag', '');
    }
}
