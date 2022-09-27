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

function createStateLI (name) {

    let td1 = simpleCreateElement("TD", name);
    let button = simpleCreateElement("BUTTON", "Edit");
    //let x = stateList.children.length - 1;
    let id = protoStateList[protoStateList.length - 1];
    button.onclick = function () {
        updateCurrentlySelectedState(id);
    }
    let td2 = simpleCreateElement("TD");
    td2.appendChild(button);
    let td3 = simpleCreateElement("TD", "No");
    let tr = simpleCreateElement("TR");
    appendMultipleChildren(tr, [td1, td2, td3]);
    stateList.appendChild(tr);

}

function createArrowTR (fromID, toID) {
    let td1 = simpleCreateElement("TD", fromID);
    let td2 = simpleCreateElement("TD", toID);
    let td3 = simpleCreateElement("TD");
    let tr = simpleCreateElement("TR");
    appendMultipleChildren(tr, [td1, td2, td3]);
    arrowList.appendChild(tr);
}

function populateControl (protoState) {
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