function simpleCreateElement (tagName, text=null) {
    let el = document.createElement(tagName);
    if (text) {
        el.innerHTML = text;
    }
    return el;
}

function createStateLI (name) {
    let li = simpleCreateElement("LI", name);
    /**
    let button = simpleCreateElement("BUTTON", "Edit");
    button.onclick = function () {
        console.log("button for: " + name + " !!!");
    }
    li.appendChild(button);
    **/
    stateList.appendChild(li);
}

function populateControl (name) {
    let p = simpleCreateElement("P", "Editing " + name + " .");
    let inp = simpleCreateElement("INPUT");
    inp.value = name;
    inp.id = "controlNameInp";
    let button = simpleCreateElement("BUTTON", "Change name");
    button.onclick = controlChangeStateName;
    let controlDiv = document.getElementById("controlDiv");
    controlDiv.appendChild(p);
    controlDiv.appendChild(inp);
    controlDiv.appendChild(button);
}