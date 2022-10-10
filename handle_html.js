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
    let td1 = simpleCreateElement("TD", protoArrow.originID);
    let td2 = simpleCreateElement("TD", protoArrow.destID);
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
    let p = simpleCreateElement("P", "Editing " + protoState.name + " .");
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

    let controlDiv = document.getElementById("controlDiv");
    appendMultipleChildren(controlDiv, 
        [p, inp, renameButton, makeBR(),
        isAcceptingLabel, isAcceptingInput,
        makeBR(), deleteButton]
    );
}

function populateArrowControl (protoArrow) {
    clearControl();
    let p1 = simpleCreateElement("P", "Editing transition.");
    let p2 = simpleCreateElement("P", "From: " + protoStateMap.get(protoArrow.originID).name);
    let p3 = simpleCreateElement("P", "To: " + protoStateMap.get(protoArrow.destID).name);
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
    appendMultipleChildren(controlDiv, [p1, p2, p3, label, select, renameBtn, makeBR(), delBtn]);
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
    td2.appendChild(btn);
    appendMultipleChildren(tr, [td1, td2]);
    tbody.append(tr);
}