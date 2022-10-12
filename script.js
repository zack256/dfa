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
const statesDiv = document.getElementById("statesPanel");
const stateList = document.getElementById("stateList");
const arrowList = document.getElementById("arrowList");
const letterList = document.getElementById("alphabetTBody");
const controlDiv = document.getElementById("controlDiv");

let dfa = null;
let protoStateList = [];
let protoStateNames = new StrictMap();    // for now
let protoStateMap = new StrictMap();
let nextProtoStateID = 1;

let protoArrowList = [];
let protoArrowMap = new StrictMap();
let nextProtoArrowID = 1;

let protoLetterMap, protoLetterNames, protoLetterList, nextProtoLetterID;
let CS, arrowOrigin;        // CS = currentlySelected, a list [what, ID]

let mousePos = new Pos(null, null);

function GSS () {
    if (CS[0] != "state") {
        err("GSS when no state selected!");
    }
    return protoStateMap.get(CS[1]);
}
function GSA () {
    if (CS[0] != "arrow") {
        err("GSA when no arrow selected!");
    }
    return protoArrowMap.get(CS[1]);
}

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
    let msg = "State # " + nextProtoStateID;
    let protoState = new ProtoState(nextProtoStateID, protoStateList.length, msg, pos, goodRadius, false);

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

    protoStateList.push(protoState.id);
    protoStateNames.set(protoState.name, protoState.id);
    protoStateMap.set(nextProtoStateID, protoState);
    createStateTR(protoState.name);
    nextProtoStateID++;
    return true;
}

function newStateWillIntersectExisting (newProtoState) {
    for (const protoStateID of protoStateList) {
        if (doOrbitsIntersect(newProtoState.pos, protoStateMap.get(protoStateID).pos, newProtoState.radius, protoStateMap.get(protoStateID).radius)) {
            return true;
        }
    }
    return false;
}

function clearStates () {
    // errm, why do we have this?
    stateList.replaceChildren();
    controlDiv.replaceChildren();
    arrowList.replaceChildren();
    letterList.replaceChildren();
    protoStateList = [];
    protoStateNames.clear();
    protoStateMap.clear();
    protoArrowList = [];
    protoArrowMap.clear();
    currentlySelected = [null, -1];
    nextProtoStateID = 1;   // Can rm if wanted.
    nextProtoArrowID = 1;   // ""
    nextProtoLetterID = 1;
    protoLetterMap.clear();
    protoLetterList = [];
    protoLetterNames.clear();
    CS = [null, -1];
    addLetter("a"); // tbd.
}

function getStateFromPos(pos) {
    var protoState;
    for (var i = 0; i < protoStateList.length; i++) {
        protoState = protoStateMap.get(protoStateList[i]);
        if (distance(pos, protoState.pos) <= protoState.radius) {
            return protoState.id;
        }
    }
    return null;
}

function controlChangeStateName () {
    let oldName = protoStateMap.get(CS[1]).name;
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
        protoStateNames.set(newName, CS[1]);
        protoStateMap.get(CS[1]).name = newName;
        stateList.children[GSS().idx].children[0].innerHTML = newName;
    }
}

function setSelectedStateAsAccepting (inp) {
    GSS().isAccepting = inp.checked;
    stateList.children[GSS().idx].children[2].innerHTML = inp.checked ? "Yes" : "No";
}

function deselectCurrent () {
    let oldTR;
    if (CS[0] == "state") {
        oldTR = stateList.children[GSS().idx];
        oldTR.classList.remove("DFA_selectedState");
    } else if (CS[0] == "arrow") {
        oldTR = arrowList.children[GSA().idx];
        oldTR.classList.remove("DFA_selectedState");
    }
    controlDiv.replaceChildren();
    CS[0] = null;
    CS[1] = -1;
}

function updateCS (newWhat, newID) {
    deselectCurrent();
    CS[0] = newWhat;
    CS[1] = newID;
    let newTR;
    if (CS[0] == "state") {
        newTR = stateList.children[GSS().idx];
        newTR.classList.add("DFA_selectedState");
        populateStateControl(GSS());
    } else if (CS[0] == "arrow") {
        newTR = arrowList.children[GSA().idx];
        newTR.classList.add("DFA_selectedState");
        populateArrowControl(GSA());
    }
}

function deleteSelectedState () {
    // Assumes a state is selected!
    let protoState = GSS();
    updateCS(null, -1);
    for (let i = protoState.idx + 1; i < protoStateList.length; i++) {
       protoStateMap.get(protoStateList[i]).idx--;
    }
    let z = 0, protoArrow;
    while (z < protoArrowList.length) {
        protoArrow = protoArrowMap.get(protoArrowList[z]);
        if (protoArrow.originID == protoState.id || protoArrow.destID == protoState.id) {
            pop(protoArrowList, z);
            arrowList.children[z].remove();
        } else {
            protoArrowMap.get(protoArrowList[z]).idx = z;
            z++;
        }
    }
    pop(protoStateList, protoState.idx);
    protoStateNames.delete(protoState.name);
    stateList.children[protoState.idx].remove();
    protoStateMap.delete(protoState.id);
}

function makeArrow (fromID, toID) {
    if (!protoStateMap.get(fromID).outgoing.has(toID)) {

        let newProtoArrow = new ProtoArrow(nextProtoArrowID, protoArrowList.length, 1, fromID, toID);
        nextProtoArrowID++;
        protoStateMap.get(fromID).outgoing.set(toID, newProtoArrow.id);
        protoStateMap.get(toID).incoming.set(fromID, newProtoArrow.id);
        protoArrowMap.set(newProtoArrow.id, newProtoArrow);
        protoArrowList.push(newProtoArrow.id);
        createArrowTR(newProtoArrow);
        updateCS("arrow", newProtoArrow.id);
    }
}

function addLetter (letterName) {
    if (protoLetterNames.has(letterName)) err ("duplicate letter add");
    let letter = new ProtoLetter(nextProtoLetterID, protoLetterList.length, letterName);
    nextProtoLetterID++;
    protoLetterList.push(letter.id);
    protoLetterNames.set(letterName, letter.id);
    protoLetterMap.set(letter.id, letter);
    addLetterTR(letter);
}

function handleAddLetter () {
    let inp = document.getElementById("addLetterInput");
    let letterName = inp.value;
    if (letterName == "") {
        alert("Name can't be blank!");
        return;
    }
    if (protoLetterNames.has(letterName)) {
        alert("A letter \"" + letterName + "\" already exists!");
        return;
    }
    addLetter(letterName);
    inp.value = "";
    //if (selectedArrowID != -1) {
    if (CS[0] == "arrow") {
        populateArrowControl(GSA());
    }
}

function handleArrowEditButton (arrowID) {
   //updateCurrentlySelectedArrow(arrowID);
   updateCS("arrow", arrowID);
}

function handleChangeTransitionButton () {
    // Handles when "change" button pressed on arrow's transition.
    let inp = document.getElementById("arrowControlLetterInp");
    let newLetter = inp.value;
    if (protoLetterNames.has(newLetter)) {
        let currentArrow = GSA();
        currentArrow.letterID = protoLetterNames.get(newLetter);
        arrowList.children[currentArrow.idx].children[2].innerHTML = protoLetterMap.get(currentArrow.letterID).name;
    }
}

function handleDeleteTransitionButton () {
    let arrow = GSA();
    updateCS(null, -1);

    for (var i = arrow.idx + 1; i < protoArrowList.length; i++) {
        protoArrowMap.get(protoArrowList[i]).idx--;
    }
    pop(protoArrowList, arrow.idx);
    arrowList.children[arrow.idx].remove();

    protoStateMap.get(arrow.originID).outgoing.delete(arrow.destID);
    protoStateMap.get(arrow.destID).incoming.delete(arrow.originID);

    protoArrowMap.delete(arrow.id);
}

function handleMouseUp (e) {
    let pos = getCanvasCoordinates(e);
    let IDOfstateClicked = getStateFromPos(pos);

    if (IDOfstateClicked == null) {
        if (arrowOrigin != -1) {
            arrowOrigin = -1;
        } else {
            let res = makeProtoState(pos);
            if (res) {
                //updateCurrentlySelectedState(nextProtoStateID - 1);
                updateCS("state", nextProtoStateID - 1);    // bad
            }
        }
    } else {
        if (arrowOrigin == IDOfstateClicked) arrowOrigin = -1; // keep :)
        if (arrowOrigin == -1) {
            //updateCurrentlySelectedState(IDOfstateClicked);
            updateCS("state", IDOfstateClicked);
        } else {
            makeArrow(arrowOrigin, IDOfstateClicked);
            arrowOrigin = -1;
        }
    }
}

function handleMouseDown (e) {
    let pos = getCanvasCoordinates(e);
    let IDOfstateClicked = getStateFromPos(pos);
    if (IDOfstateClicked != null) {
        arrowOrigin = IDOfstateClicked;
    }
}

function goodReset () {
    protoLetterList = [];   // aka protoAlphabet?
    protoLetterNames = new StrictMap();
    protoLetterMap = new StrictMap();
    nextProtoLetterID = 1;
    CS = [null, -1];
    arrowOrigin = -1;
}

function initProtoStage () {
    goodReset();
    addLetter("a"); // demo
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

initProtoStage();