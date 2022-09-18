function simpleCreateElement (tagName, text) {
    let el = document.createElement(tagName);
    el.innerHTML = text;
    return el;
}

function createStateLI (name) {
    let li = simpleCreateElement("LI", name);
    let button = simpleCreateElement("BUTTON", "Edit");
    button.onclick = function () {
        console.log("button for: " + name + " !!!");
    }
    li.appendChild(button);
    stateList.appendChild(li);
}

function populateControl (name) {
    let p = simpleCreateElement("P", "Editing " + name + " .");
    let controlDiv = document.getElementById("controlDiv");
    controlDiv.appendChild(p);
}