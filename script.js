let radius = 50;
let goodFont = "20px sans-serif";

function getCanvas () {
    return document.getElementsByTagName("canvas")[0];
}

function getContext () {
    return canvas.getContext("2d");
}

function drawState (ctx, name, x, y) {
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();

    //ctx.textAlign = "center";
    //ctx.textBaseline = "middle";
    //ctx.font = goodFont;
    ctx.fillText(name, x, y);
}

function getCanvasCoordinates (canvas, e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    return [mouseX, mouseY];
}

function handleMouseUp (e, canvas, ctx) {
    let [xCoord, yCoord] = getCanvasCoordinates(canvas, e);
    //drawState(ctx, "test", xCoord, yCoord);
    let msg = "State # " + getRandomNumber(0, 20);
    exampleStates.push([xCoord, yCoord, msg]);
}

function alignCanvas (canvas) {
    // I don't know if this works...
    let canvasWidth = canvas.width;
    let canvasContainer = canvas.parentElement;
    canvasContainer.style.left = "calc((100% - " + canvasWidth + "px) / 2.0)";
}

function getRandomNumber (low, high) {
    let delta = high - low;
    return low + Math.random() * delta;
}

function getRandomStateCoords (canvas) {
    // Prevents bleeding off edge of canvas.
    let width = canvas.width;
    let height = canvas.height;
    let x = getRandomNumber(radius, width - radius);
    let y = getRandomNumber(radius, height - radius);
    return [x, y];
}

function drawDFA (canvas, ctx, dfa) {
    var state, x, y;
    for (var i = 0; i < dfa.states.length; i++) {
        state = dfa.states[i];
        [x, y] = getRandomStateCoords(canvas);
        drawState(ctx, state.name, x, y);
    }
}

const canvas = getCanvas();
const ctx = getContext(canvas);
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = goodFont;

let exampleStates = [];

function clearStates () {
    exampleStates = [];
}

function draw () {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var name, xCoord, yCoord;
    for (var i = 0; i < exampleStates.length; i++) {
        [xCoord, yCoord, name] = exampleStates[i];
        drawState(ctx, name, xCoord, yCoord);
    }

    window.requestAnimationFrame(draw);
}

canvas.addEventListener("mouseup", function (e) {
    handleMouseUp(e, canvas, ctx);
});

window.addEventListener("load", function (e) {

    // yeah this stuff prob isnt nesc.
    alignCanvas(canvas);
    canvas.parentElement.style.display = "block";

    //drawDFA(canvas, ctx, d);

    window.requestAnimationFrame(draw);

});