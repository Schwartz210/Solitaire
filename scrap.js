function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("Text", ev.target.id);
}

function drag2(ev) {
  ev.dataTransfer.src("src", ev.target.id);
}

function drop(ev) {
  var data = ev.dataTransfer.getData("Text");
  ev.target.appendChild(document.getElementById(data));
  ev.preventDefault();
}

function drop2(ev) {
  var data = ev.dataTransfer.getData("src");
  ev.target.appendChild(document.getElementById(data));
  ev.preventDefault();
}
