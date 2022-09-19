function simpleCreateElement (tagName, text=null) {
    let el = document.createElement(tagName);
    if (text) {
        el.innerHTML = text;
    }
    return el;
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
    let tr = simpleCreateElement("TR");
    tr.appendChild(td1);
    tr.appendChild(td2);
    stateList.appendChild(tr);

}

function populateControl (name) {
    let p = simpleCreateElement("P", "Editing " + name + " .");
    let inp = simpleCreateElement("INPUT");
    inp.value = name;
    inp.id = "controlNameInp";
    let renameButton = simpleCreateElement("BUTTON", "Change name");
    renameButton.onclick = controlChangeStateName;
    let deleteButton = simpleCreateElement("BUTTON", "Delete");
    deleteButton.onclick = deleteSelectedState;

    let controlDiv = document.getElementById("controlDiv");
    controlDiv.appendChild(p);
    controlDiv.appendChild(inp);
    controlDiv.appendChild(renameButton);
    controlDiv.appendChild(deleteButton);
}

function clearControl () {
    console.log("hola");
    while (controlDiv.children.length) {
        controlDiv.children[0].remove();
    }
}