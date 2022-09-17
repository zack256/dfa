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
let protoStates = [];

function setupCanvas () {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px sans-serif";
}

function getCanvasCoordinates (e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    return [mouseX, mouseY];
}

function makeProtoState (xCoord, yCoord) {
    let msg = "State # " + getRandomNumber(0, 20);
    //let drawProperties = {"x" : xCoord, "y" : yCoord, "radius" : goodRadius};
    let stateProperties = {"name" : msg, "x" : xCoord, "y" : yCoord, "radius" : goodRadius};
    //let state = new State(msg, drawProperties);

    /**
    // Temporary + bad!
    if (dfa == null) {
        dfa = new DFA([msg], ["a"], [[msg]], msg, []);
        dfa.states[0] = state;
    } else {
        dfa.states.push(state);
    }
    **/

    // Optional, maybe:
    if (newStateWillIntersectExisting(stateProperties)) {
        console.log("Intersection found. Not adding state...");
        return;
    }

    protoStates.push(stateProperties);
}

function newStateWillIntersectExisting (stateProperties) {
    let pos1 = [stateProperties.x, stateProperties.y];
    var pos2;
    for (const protoState of protoStates) {
        pos2 = [protoState.x, protoState.y];
        if (doOrbitsIntersect(pos1, pos2, stateProperties.radius, protoState.radius)) {
            return true;
        }
    }
    return false;
}

function clearStates () {
    protoStates = [];
}

function handleMouseUp (e) {
    let [xCoord, yCoord] = getCanvasCoordinates(e);
    makeProtoState(xCoord, yCoord);
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