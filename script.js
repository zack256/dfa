function getCanvasAndContext () {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    return [canvas, context];
}

function alignCanvas () {
    // I don't know if this works...
    let canvasWidth = canvas.width;
    let canvasContainer = canvas.parentElement;
    canvasContainer.style.left = "calc((100% - " + canvasWidth + "px) / 2.0)";
    canvas.parentElement.style.display = "block";
}

const [canvas, ctx] = getCanvasAndContext();

let dfa = null;

function setupCanvas () {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px sans-serif";
}

function getRandomNumber (low, high) {
    // [low, high)
    let delta = high - low;
    return low + Math.random() * delta;
}

function getCanvasCoordinates (e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    return [mouseX, mouseY];
}

function handleMouseUp (e) {
    let [xCoord, yCoord] = getCanvasCoordinates(e);
    let msg = "State # " + getRandomNumber(0, 20);
    let state = new State(msg, xCoord, yCoord);

    // Temporary + bad!
    if (dfa == null) {
        dfa = new DFA([msg], ["a"], [[msg]], msg, []);
        dfa.states[0] = state;
    } else {
        dfa.states.push(state);
    }

}

canvas.addEventListener("mouseup", function (e) {
    handleMouseUp(e);
});

window.addEventListener("load", function (e) {

    // yeah this stuff prob isnt nesc.
    alignCanvas();

    setupCanvas();

    window.requestAnimationFrame(draw);

});