

// The amount of symbol we want to place;
var count = 100;
var spaceship = document.querySelector(".spaceship");

// Create a symbol, which we will use to place instances of later:
var path = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black'
});

var symbol = new SymbolDefinition(path);

// Place the instances of the symbol:
for (var i = 0; i < count; i++) {
    // The center position is a random point in the view:
    var center = Point.random() * view.size;
    var placed = symbol.place(center);
    var scale = (i + 1) / count;
    placed.scale(scale);
    placed.data.vector = new Point({
        angle: Math.random() * 360,
        length : scale * Math.random() / 5
    });
}

var vector = new Point({
    angle: 45,
    length: 0
});

var mouseVector = vector.clone();
var handVector = vector.clone();

function onMouseMove(event) {
    mouseVector = view.center - event.point;
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
    // handVector.x = sessionStorage.getItem("x");
    if (sessionStorage.getItem("x") > 0.6) {
        handVector.x = -(sessionStorage.getItem("x"));
    } else if (sessionStorage.getItem("x") < 0.4) {
        handVector.x = +(sessionStorage.getItem("x")) * 5;
    } else {
        handVector.x = 0;
    }
    if(sessionStorage.getItem("y") > 0.6){
        handVector.y = -(sessionStorage.getItem("y"));
    } else if(sessionStorage.getItem("y") < 0.4){
        handVector.y = +(sessionStorage.getItem("y")) * 3;
    } else {
        handVector.y = 0;
    }
    // Rotate spaceship by the vector with css
    vector = vector + (handVector * 100 - vector) / 30;
    spaceship.style.transform = "rotate(" + (vector.angle - 90) + "deg)";

    // Run through the active layer's children list and change
    // the position of the placed symbols:
    for (var i = 0; i < count; i++) {
        var item = project.activeLayer.children[i];
        var size = item.bounds.size;
        var length = vector.length / 10 * size.width / 10;
        item.position += vector.normalize(length) + item.data.vector;
        keepInView(item);
    }
}

function keepInView(item) {
    var position = item.position;
    var itemBounds = item.bounds;
    var bounds = view.bounds;
    if (itemBounds.left > bounds.width) {
        position.x = -item.bounds.width;
    }

    if (position.x < -itemBounds.width) {
        position.x = bounds.width + itemBounds.width;
    }

    if (itemBounds.top > view.size.height) {
        position.y = -itemBounds.height;
    }

    if (position.y < -itemBounds.height) {
        position.y = bounds.height  + itemBounds.height / 2;
    }
}

