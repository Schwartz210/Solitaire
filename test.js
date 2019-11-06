function handler(e) {
    e = e || window.event;

    var pageX = e.clientX;
    var pageY = e.pageY;

    // IE 8

    console.log(pageX, pageY);
}

// attach handler to the click event of the document
if (document.attachEvent) document.attachEvent('onclick', handler);
else document.addEventListener('click', handler);
