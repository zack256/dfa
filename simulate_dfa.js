let currentStateID = 0;

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

async function simulateDFA (word) {
    // Visually simulated the DFA.
    // Word is an array of letter IDs.
    let deltaFunc = checkProtoDFA();
    let letterIDs = letterArrayToLetterIDArray(word);
    currentStateID = Number(getStartingStateValue());
    for (var i = 0; i < word.length; i++) {
        await sleep(sleepInterval);
        let nextArrowID = deltaFunc.get(currentStateID).get(letterIDs[i]);
        currentStateID = protoStateMap.get(protoArrowMap.get(nextArrowID).destID).id;
    }
}