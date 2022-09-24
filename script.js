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
const arrowList = document.getElementById("arrowList");
const controlDiv = document.getElementById("controlDiv");

let dfa = null;
let protoStates = [];
let protoStateNames = new StrictMap();    // for now
let protoArrows = [];

let selectedStateIdx = -1;
let arrowOrigin = -1;

let mousePos = new Pos(null, null);

function setupCanvas () {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px sans-serif";
}

function getCanvasCoordinates (e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    return new Pos(mouseX, mouseY);
}

function makeProtoState (pos) {
    let msg = "State # " + getRandom2DecimalDigitNumber(0, 1000);
    let protoState = new ProtoState(msg, pos, goodRadius, false);

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
    if (newStateWillIntersectExisting(protoState)) {
        console.log("Intersection found. Not adding state...");
        return false;
    }

    protoStates.push(protoState);
    protoStateNames.set(protoState.name, protoStates.length - 1);
    createStateLI(protoState.name);
    return true;
}

function newStateWillIntersectExisting (newProtoState) {
    for (const protoState of protoStates) {
        if (doOrbitsIntersect(newProtoState.pos, protoState.pos, newProtoState.radius, protoState.radius)) {
            return true;
        }
    }
    return false;
}

function clearStates () {
    stateList.replaceChildren();
    controlDiv.replaceChildren();
    protoStates = [];
    protoStateNames.clear();
    selectedStateIdx = -1;
}

function getStateFromPos(pos) {
    var protoState;
    for (var i = 0; i < protoStates.length; i++) {
        protoState = protoStates[i];
        if (distance(pos, protoState.pos) <= protoState.radius) {
            return i;
        }
    }
    return null;
}

function controlChangeStateName () {
    let oldName = protoStates[selectedStateIdx].name;
    let newName = document.getElementById("controlNameInp").value;
    if (oldName == newName) return;
    if (newName == "") {
        alert("Name can't be blank!");
        return;
    }
    if (protoStateNames.has(newName)) {
        alert("A state already has the name \"" + newName + "\"!");
        return;
    } else {
        protoStateNames.delete(oldName);
        protoStateNames.set(newName, selectedStateIdx);
        protoStates[selectedStateIdx].name = newName;
        stateList.children[selectedStateIdx].children[0].innerHTML = newName;
    }
}

function setSelectedStateAsAccepting (inp) {
    protoStates[selectedStateIdx].isAccepting = inp.checked;
    stateList.children[selectedStateIdx].children[2].innerHTML = inp.checked ? "Yes" : "No";
}

function updateCurrentlySelectedState (idx) {

    //if (selectedStateIdx == idx) return;

    if (selectedStateIdx != -1) {
        let oldLI = stateList.children[selectedStateIdx];
        oldLI.classList.remove("DFA_selectedState");
        controlDiv.replaceChildren();
    }
    selectedStateIdx = idx;
    if (selectedStateIdx != -1) {
        let newLI = stateList.children[selectedStateIdx];
        newLI.classList.add("DFA_selectedState");
        populateControl(protoStates[selectedStateIdx]);
    } else {
        clearControl();
    }
}

function deleteSelectedState () {
    for (let i = selectedStateIdx + 1; i < protoStates.length; i++) {
        stateList.children[i].children[1].children[0].onclick = function () {
            updateCurrentlySelectedState(i - 1);
        }
    }
    let z = 0;
    console.log(selectedStateIdx);
    console.log(protoArrows);
    while (z < protoArrows.length) {
        if (protoArrows[z][0] == selectedStateIdx || protoArrows[z][1] == selectedStateIdx) {
            pop(protoArrows, z);
            continue;
        }
        if (protoArrows[z][0] > selectedStateIdx) protoArrows[z][0]--;
        if (protoArrows[z][1] > selectedStateIdx) protoArrows[z][1]--;
        z++;
    }
    let protoState = pop(protoStates, selectedStateIdx);
    protoStateNames.delete(protoState.name);
    stateList.children[selectedStateIdx].remove();
    selectedStateIdx = -1;
    updateCurrentlySelectedState(-1);
}

function makeArrow (fromIdx, toIdx) {
    if (protoStates[fromIdx].outgoing.has(toIdx)) return;
    protoStates[fromIdx].outgoing.set(toIdx, null); //tbd
    protoStates[toIdx].incoming.set(fromIdx, null);
    protoArrows.push([fromIdx, toIdx]);
    createArrowTR(fromIdx, toIdx);
    arrowOrigin = -1;
}

function handleMouseUp (e) {
    let pos = getCanvasCoordinates(e);
    let idxOfstateClicked = getStateFromPos(pos);

    if (idxOfstateClicked == null) {
        if (arrowOrigin != -1) {
            arrowOrigin = -1;
        } else {
            let res = makeProtoState(pos);
            if (res) {
                updateCurrentlySelectedState(protoStates.length - 1);
            }
        }
    } else {
        console.log(arrowOrigin + " !!!");
        if (arrowOrigin == idxOfstateClicked) arrowOrigin = -1;
        if (arrowOrigin == -1) {
            updateCurrentlySelectedState(idxOfstateClicked);
        } else {
            console.log("we have made an arrow from " + arrowOrigin + " to " + idxOfstateClicked + "!!");
            makeArrow(arrowOrigin, idxOfstateClicked);
        }
    }
}

function handleMouseDown (e) {
    let pos = getCanvasCoordinates(e);
    let idxOfstateClicked = getStateFromPos(pos);
    if (idxOfstateClicked != null) {
        arrowOrigin = idxOfstateClicked;
    }
}

function handleMouseMove (e) {
    mousePos = getCanvasCoordinates(e);
}

canvas.addEventListener("mouseup", function (e) {
    handleMouseUp(e);
});
canvas.addEventListener("mousedown", function (e) {
    handleMouseDown(e);
});
canvas.addEventListener("mousemove", function (e) {
    handleMouseMove(e);
});

window.addEventListener("load", function (e) {

    // yeah this stuff prob isnt nesc.
    alignCanvas();

    setupCanvas();

    window.requestAnimationFrame(draw);

});