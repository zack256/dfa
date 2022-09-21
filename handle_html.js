function simpleCreateElement (tagName, text=null) {
    let el = document.createElement(tagName);
    if (text != null) {
        el.innerHTML = text;
    }
    return el;
}

function makeBreak () {
    return simpleCreateElement("BR");
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
    let idx = protoStates.length - 1;
    button.onclick = function () {
        updateCurrentlySelectedState(idx);
    }
    let td2 = simpleCreateElement("TD");
    td2.appendChild(button);
    let td3 = simpleCreateElement("TD", "No");
    let tr = simpleCreateElement("TR");
    appendMultipleChildren(tr, [td1, td2, td3]);
    stateList.appendChild(tr);

}

function createArrowTR (fromIdx, toIdx) {
    let td1 = simpleCreateElement("TD", fromIdx);
    let td2 = simpleCreateElement("TD", toIdx);
    let tr = simpleCreateElement("TR");
    appendMultipleChildren(tr, [td1, td2]);
    arrowList.appendChild(tr);
}

function populateControl (protoState) {
    let p = simpleCreateElement("P", "Editing " + protoState.name + " .");
    let inp = simpleCreateElement("INPUT");
    inp.value = protoState.name;
    inp.id = "controlNameInp";
    let renameButton = simpleCreateElement("BUTTON", "Change name");
    renameButton.onclick = controlChangeStateName;
    let deleteButton = simpleCreateElement("BUTTON", "Delete");
    deleteButton.onclick = deleteSelectedState;

    let isAcceptingLabel = simpleCreateElement("LABEL", "Is Accepting?")
    let isAcceptingInput = simpleCreateElement("INPUT");
    isAcceptingInput.type = "checkbox";
    isAcceptingInput.checked = protoState.isAccepting;
    isAcceptingInput.oninput = function () {
        setSelectedStateAsAccepting(isAcceptingInput);
    }

    let controlDiv = document.getElementById("controlDiv");
    appendMultipleChildren(controlDiv, 
        [p, inp, renameButton, makeBreak(),
        isAcceptingLabel, isAcceptingInput,
        makeBreak(), deleteButton]
    );

}

function clearControl () {
    console.log("hola");
    while (controlDiv.children.length) {
        controlDiv.children[0].remove();
    }
}