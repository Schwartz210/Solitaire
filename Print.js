class P{
    constructor(){}
    static out(something){
        var toConsole = "";
        if (something == undefined){
            toConsole = "var undefined";
        } else if (something.constructor === Array){
            toConsole = "[";
            for (var i=0;i<something.length;i++){
                toConsole += something[i];
                if (i != something.length-1){
                    toConsole += ', ';
                }
            }
            toConsole += "]"
        }  else if (something.constructor === Set){
            toConsole = "{";
            for (var elem of something){
                toConsole += elem;
                toConsole += ', ';
            }
            toConsole += "}"
        }else if (typeof something == 'string' || typeof something == 'number') {
            toConsole = something;
        } else if (something.constructor == Deck){
            for (var card of something.availableCards){
                toConsole += card.rank + " of " + card.suit + '\n';
            }
        }
        console.log(toConsole);
    }






}
