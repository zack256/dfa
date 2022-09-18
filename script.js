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
const statesDiv = document.getElementById("statesDiv");
const stateList = document.getElementById("stateList");
const controlDiv = document.getElementById("controlDiv");

let dfa = null;
let protoStates = [];

let selectedStateIdx = -1;

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
    createStateLI(stateProperties.name);
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
    stateList.replaceChildren();
    controlDiv.replaceChildren();
    protoStates = [];
    selectedStateIdx = -1;
}

function getStateFromPos(pos) {
    var protoState, pos2;
    for (var i = 0; i < protoStates.length; i++) {
        protoState = protoStates[i];
        pos2 = [protoState.x, protoState.y];
        if (distance(pos, pos2) <= protoState.radius) {
            return i;
        }
    }
    return null;
}

function updateCurrentlySelectedState (idx) {
    /**
    let li = document.createElement("LI");
    li.innerHTML = "Editing " + protoStates[idx].name;
    statesDiv.appendChild(p);
    **/

    if (selectedStateIdx == idx) return;

    if (selectedStateIdx != -1) {
        let oldLI = stateList.children[selectedStateIdx];
        oldLI.classList.remove("DFA_selectedState");
        controlDiv.replaceChildren();
    }
    selectedStateIdx = idx;
    let newLI = stateList.children[selectedStateIdx];
    newLI.classList.add("DFA_selectedState");
    populateControl(protoStates[selectedStateIdx].name);
}

function handleMouseUp (e) {

    let pos = getCanvasCoordinates(e);
    let idxOfstateClicked = getStateFromPos(pos);
    if (idxOfstateClicked == null) {
        makeProtoState(pos[0], pos[1]);
    } else {
        updateCurrentlySelectedState(idxOfstateClicked);
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