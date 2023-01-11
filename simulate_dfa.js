let currentStateID = 0;
let currentArrowID = 0;

let sleepInterval = 1000;   // ms

function makeLetterToIDMap () {
    let letter2ID = new StrictMap();
    for (var i = 0; i < protoLetterList.length; i++) {
        let letter = protoLetterMap.get(protoLetterList[i]);
        letter2ID.set(letter.name, letter.id);
    }
    return letter2ID;
}

function letterArrayToLetterIDArray (word) {
    // Converts an array of letter strings to one of letter IDs.
    let letter2ID = makeLetterToIDMap();
    let newWord = [];
    for (var i = 0; i < word.length; i++) {
        if (!letter2ID.has(word[i])) {
            err("Letter \"" + word[i] + "\" not found in alphabet!");
        }
        newWord.push(letter2ID.get(word[i]));
    }
    return newWord;
}

function readWordFromPanel () {
    let tbody = document.getElementById("wordTBody");
    let word = [];
    for (let i = 0; i < tbody.children.length; i++) {
        let letter = tbody.children[i].children[1].innerHTML;
        word.push(letter);
    }
    return word;
}

async function simulateDFA (word=null) {
    // Visually simulated the DFA.
    // Word is an array of letter IDs.
    let deltaFunc = checkProtoDFA();
    if (word == null) {
        word = readWordFromPanel();
    }
    let letterIDs = letterArrayToLetterIDArray(word);
    currentStateID = Number(getStartingStateValue());
    let wordTBody = document.getElementById("wordTBody");
    for (let i = 0; i < word.length; i++) {
        await sleep(sleepInterval);
        currentArrowID = deltaFunc.get(currentStateID).get(letterIDs[i]);
        currentStateID = protoStateMap.get(protoArrowMap.get(currentArrowID).destID).id;
        wordTBody.children[i].classList.add("simulatingLetter");
        if (i != 0) {
            wordTBody.children[i - 1].classList.remove("simulatingLetter");
        }
    }
    await sleep(sleepInterval);
    if (word.length) {
        wordTBody.children[word.length - 1].classList.remove("simulatingLetter");
    }
    currentStateID = 0;
    currentArrowID = 0;
}