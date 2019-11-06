class SlotTracker {
    constructor(){
        this.map = {};
        for (var i=0;i<7;i++){
            this.map[Size.ySlot(i)] = i+1;
        }
    }

    alter(key, symbol){
        if (symbol == '+'){
            this.map[key] = this.map[key] + 1;
        } else if (symbol == '-'){
            this.map[key] = this.map[key] - 1;
        }
    }

    print(){
        console.log("SlotTracker summary: ");
        console.log('    Slot 1: '+this.map[0]);
        console.log('    Slot 2: '+this.map[110]);
        console.log('    Slot 3: '+this.map[220]);
        console.log('    Slot 4: '+this.map[330]);
        console.log('    Slot 5: '+this.map[440]);
        console.log('    Slot 6: '+this.map[550]);
        console.log('    Slot 7: '+this.map[660]);
    }

    getSlot(mouseX){
        var pix = 0;
        for (var i=0;i<7;i++){
            pix = i * 110;
            if (mouseX > pix && mouseX <= pix + 100){
                return pix;
            }
        }
        return -1;
    }

    isEmptySlot(mouseX){
        if (this.map[this.getSlot(mouseX)] == 0){
            return true;
        } else {
            return false;
        }
    }
}
