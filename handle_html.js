function simpleCreateElement (tagName, text=null) {
    let el = document.createElement(tagName);
    if (text != null) {
        el.innerHTML = text;
    }
    return el;
}

function makeBR () {
    return simpleCreateElement("BR");
}
function makeHR () {
    return simpleCreateElement("HR");
}

function makeTable (header, rows) {
    let table = simpleCreateElement("TABLE");
    if (header != null) {
        let thead = simpleCreateElement("THEAD");
        thead.appendChild(header);
        table.appendChild(thead);
    }
    let tbody = simpleCreateElement("TBODY");
    appendMultipleChildren(tbody, rows);
    table.appendChild(tbody);
    return table;
}

function appendMultipleChildren (parentElement, childElements) {
    var childElement;
    for (var i = 0; i < childElements.length; i++) {
        childElement = childElements[i];
        parentElement.appendChild(childElement);
    }
}

function createStateTR (name) {

    let td1 = simpleCreateElement("TD", name);
    let button = simpleCreateElement("BUTTON", "Edit");
    //let x = stateList.children.length - 1;
    let id = protoStateList[protoStateList.length - 1];
    button.onclick = function () {
        //updateCurrentlySelectedState(id);
        updateCS("state", id);
    }
    let td2 = simpleCreateElement("TD");
    td2.appendChild(button);
    let td3 = simpleCreateElement("TD", "No");
    let tr = simpleCreateElement("TR");
    appendMultipleChildren(tr, [td1, td2, td3]);
    stateList.appendChild(tr);

}

function createArrowTR (protoArrow) {
    let td1 = simpleCreateElement("TD", protoStateMap.get(protoArrow.originID).name);
    let td2 = simpleCreateElement("TD", protoStateMap.get(protoArrow.destID).name);
    let td3 = simpleCreateElement("TD", protoLetterMap.get(protoArrow.letterID).name);
    let btn = simpleCreateElement("BUTTON", "Edit");
    let id = protoArrow.id;
    btn.onclick = function () {
        handleArrowEditButton(id);
    }
    let td4 = simpleCreateElement("TD");
    td4.appendChild(btn);
    let tr = simpleCreateElement("TR");
    appendMultipleChildren(tr, [td1, td2, td3, td4]);
    arrowList.appendChild(tr);
}

function populateStateControl (protoState) {
    clearControl();
    let p1 = simpleCreateElement("P", "Editing " + protoState.name + " .");
    let inp = simpleCreateElement("INPUT");
    inp.value = protoState.name;
    inp.id = "controlNameInp";
    let renameButton = simpleCreateElement("BUTTON", "Change name");
    renameButton.onclick = controlChangeStateName;

    let isAcceptingLabel = simpleCreateElement("LABEL", "Is Accepting?")
    let isAcceptingInput = simpleCreateElement("INPUT");
    isAcceptingInput.type = "checkbox";
    isAcceptingInput.checked = protoState.isAccepting;
    isAcceptingInput.oninput = function () {
        setSelectedStateAsAccepting(isAcceptingInput);
    }

    let deleteButton = simpleCreateElement("BUTTON", "Delete");
    deleteButton.onclick = deleteSelectedState;

    let p2 = simpleCreateElement("P", "Outgoing Transitions");
    let TTHeader = simpleCreateElement("TR");
    appendMultipleChildren(TTHeader, [
        simpleCreateElement("TH", "To"),
        simpleCreateElement("TH", "Letter"),
        simpleCreateElement("TH", "Edit")
    ]);
    
    let TTRows = [], tr, arrow, btn;
    for (const [stateID, arrowID] of protoState.outgoing.entries()) {
        state = protoStateMap.get(stateID);
        arrow = protoArrowMap.get(arrowID);
        tr = simpleCreateElement("TR");
        btn = simpleCreateElement("BUTTON", "Edit");
        btn.onclick = function () { handleArrowEditButton(arrowID); }
        appendMultipleChildren(tr, [
            simpleCreateElement("TD", state.name),
            simpleCreateElement("TD", protoLetterMap.get(arrow.letterID).name),
            btn
        ]);
        TTRows.push(tr);
    }
    let outgoingTable = makeTable(TTHeader, TTRows);

    let p3 = simpleCreateElement("P", "Incoming Transitions");
    TTHeader = simpleCreateElement("TR");
    appendMultipleChildren(TTHeader, [
        simpleCreateElement("TH", "From"),
        simpleCreateElement("TH", "Letter"),
        simpleCreateElement("TH", "Edit")
    ]);

    TTRows = [];
    for (const [stateID, arrowID] of protoState.incoming.entries()) {
        state = protoStateMap.get(stateID);
        arrow = protoArrowMap.get(arrowID);
        tr = simpleCreateElement("TR");
        btn = simpleCreateElement("BUTTON", "Edit");
        btn.onclick = function () { handleArrowEditButton(arrowID); }
        appendMultipleChildren(tr, [
            simpleCreateElement("TD", state.name),
            simpleCreateElement("TD", protoLetterMap.get(arrow.letterID).name),
            btn
        ]);
        TTRows.push(tr);
    }
    let incomingTable = makeTable(TTHeader, TTRows);

    let prevBtn = simpleCreateElement("BUTTON", "Previous");
    prevBtn.onclick = function () { cycleDisplay(-1) };
    let nextBtn = simpleCreateElement("BUTTON", "Next");
    nextBtn.onclick = function () { cycleDisplay(1) };

    let controlDiv = document.getElementById("controlDiv");
    appendMultipleChildren(controlDiv, 
        [p1, inp, renameButton, makeBR(),
        isAcceptingLabel, isAcceptingInput,
        makeBR(), deleteButton, p2, outgoingTable, p3,
        incomingTable, prevBtn, nextBtn]
    );

}

function populateArrowControl (protoArrow) {
    clearControl();
    let p1 = simpleCreateElement("P", "Editing transition.");
    let td1, td2, td3, btn, tr1, tr2, tbl;

    td1 = simpleCreateElement("TD", "From:");
    td2 = simpleCreateElement("TD", protoStateMap.get(protoArrow.originID).name);
    btn = simpleCreateElement("BUTTON", "Go");
    btn.onclick = function () { updateCS("state", protoArrow.originID) };
    td3 = simpleCreateElement("TD");
    td3.appendChild(btn);
    tr1 = simpleCreateElement("TR");
    appendMultipleChildren(tr1, [td1, td2, td3]);

    td1 = simpleCreateElement("TD", "To:");
    td2 = simpleCreateElement("TD", protoStateMap.get(protoArrow.destID).name);
    btn = simpleCreateElement("BUTTON", "Go");
    btn.onclick = function () { updateCS("state", protoArrow.destID) };
    td3 = simpleCreateElement("TD");
    td3.appendChild(btn);
    tr2 = simpleCreateElement("TR");
    appendMultipleChildren(tr2, [td1, td2, td3]);

    tbl = makeTable(null, [tr1, tr2]);

    let label = simpleCreateElement("LABEL", "Letter: ");
    let select = simpleCreateElement("SELECT");
    select.id = "arrowControlLetterInp";
    let option, letter;
    for (const letterID of protoLetterList) {
        letter = protoLetterMap.get(letterID);
        option = simpleCreateElement("OPTION", letter.name);
        if (protoArrow.letterID == letterID) {
            option.setAttribute("selected", "selected");
        }
        select.appendChild(option);
    }
    let renameBtn = simpleCreateElement("BUTTON", "Change");
    renameBtn.onclick = handleChangeTransitionButton;
    //let p4 = simpleCreateElement("P", "Letter: " + protoLetterMap.get(protoArrow.letterID).name);
    let delBtn = simpleCreateElement("BUTTON", "Delete");
    delBtn.onclick = handleDeleteTransitionButton;

    let prevBtn = simpleCreateElement("BUTTON", "Previous");
    prevBtn.onclick = function () { cycleDisplay(-1) };
    let nextBtn = simpleCreateElement("BUTTON", "Next");
    nextBtn.onclick = function () { cycleDisplay(1) };

    appendMultipleChildren(controlDiv, [p1, tbl, label, select, renameBtn, makeBR(),
        delBtn, makeBR(), prevBtn, nextBtn]);
}

function populateLetterControl (letter) {
    clearControl();
    let p = simpleCreateElement("P", "Editing letter");
    let inp = simpleCreateElement("INPUT");
    inp.value = letter.name;
    inp.id = "letterControlNameInp";
    let renameButton = simpleCreateElement("BUTTON", "Change name");
    renameButton.onclick = controlChangeLetterName;

    let prevBtn = simpleCreateElement("BUTTON", "Previous");
    prevBtn.onclick = function () { cycleDisplay(-1) };
    let nextBtn = simpleCreateElement("BUTTON", "Next");
    nextBtn.onclick = function () { cycleDisplay(1) };

    appendMultipleChildren(controlDiv, [
        p, inp, renameButton, makeBR(), prevBtn, nextBtn
    ]);
}

function clearControl () {
    while (controlDiv.children.length) {
        controlDiv.children[0].remove();
    }
}

function changePanel (panelName) {
    document.getElementsByClassName("activePanel")[0].classList.remove("activePanel");
    document.getElementById(panelName + "Panel").classList.add("activePanel");
}

function addLetterTR (letter) {
    let tbody = document.getElementById("alphabetTBody");
    let tr = simpleCreateElement("TR");
    let td1 = simpleCreateElement("TD", letter.name);
    let td2 = simpleCreateElement("TD");
    let btn = simpleCreateElement("BUTTON", "Edit");
    btn.onclick = function () {
        handleEditLetterButton(letter.id);
    }
    td2.appendChild(btn);
    appendMultipleChildren(tr, [td1, td2]);
    tbody.append(tr);
}