function simpleCreateElement (tagName, text=null) {
    let el = document.createElement(tagName);
    if (text) {
        el.innerHTML = text;
    }
    return el;
}

function makeBreak () {
    return simpleCreateElement("BR");
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
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    stateList.appendChild(tr);

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
    controlDiv.appendChild(p);
    controlDiv.appendChild(inp);
    controlDiv.appendChild(renameButton);
    controlDiv.appendChild(makeBreak());
    controlDiv.appendChild(isAcceptingLabel);
    controlDiv.appendChild(isAcceptingInput);
    controlDiv.appendChild(makeBreak());
    controlDiv.appendChild(deleteButton);

}

function clearControl () {
    console.log("hola");
    while (controlDiv.children.length) {
        controlDiv.children[0].remove();
    }
}