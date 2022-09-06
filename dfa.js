function err (msg) {
    // replacing the throws.
    console.error(msg);
    process.exit(1);
}

class State {
    constructor (name) {
        this.name = name;
    }
}

class Letter {
    constructor (name) {
        this.name = name;
    }
}

function formatStates (givenStates) {
    let states = [];
    let state2Idx = new Map();
    for (var i = 0; i < givenStates.length; i++) {
        if (state2Idx.has(givenStates[i])) {
            err("Duplicate state given: " + givenStates[i]);
        }
        state2Idx.set(givenStates[i], state2Idx.size);
        state = new State(givenStates[i]);
        states.push(state);
    }
    return [states, state2Idx];
}

function formatAlphabet (givenAlphabet) {
    let alphabet = [];
    let letter2Idx = new Map();     // "letter", just a member of the alphabet.
    for (var i = 0; i < givenAlphabet.length; i++) {
        if (letter2Idx.has(givenAlphabet[i])) {
            err("Duplicate letter given: " + givenAlphabet[i]);
        }
        letter2Idx.set(givenAlphabet[i], letter2Idx.size);
        letter = new Letter(givenAlphabet[i]);
        alphabet.push(letter);
    }
    return [alphabet, letter2Idx];
}

function formatDeltaGivenNumberMatrix (givenDelta, state2Idx, letter2Idx) {
    if (givenDelta.length != state2Idx.size) {
        err("Invalid # rows of delta matrix, must match # states (" + state2Idx.length + ").");
    }
    for (var i = 0; i < givenDelta.length; i++) {
        if (givenDelta[i].length != letter2Idx.size) {
            err("Invalid # columns of a row of the delta matrix, must match # letters (" + letter2Idx.size + ").");
        }
        for (var j = 0; j < givenDelta.length; j++) {
            if (givenDelta[i][j] < 0 || givenDelta[i][j] >= state2Idx.size) {
                err("Invalid entry in delta matrix!");
            }
        }
    }
    return givenDelta;
}

function formatDeltaGivenNameMatrix (givenDelta, state2Idx, letter2Idx) {
    let deltaMatrix = [];
    for (var i = 0; i < givenDelta.length; i++) {
        deltaMatrix.push([]);
        for (var j = 0; j < givenDelta[i].length; j++) {
            if (!state2Idx.has(givenDelta[i][j])) {
                err("Entry " + givenDelta[i][j] + " not found in states provided!");
            }
            deltaMatrix[i].push(givenDelta[i][j]);
        }
    }
    return formatDeltaGivenNumberMatrix(givenDelta, state2Idx, letter2Idx);
}

function formatStartingState (startingState, state2Idx) {
    if (!state2Idx.has(startingState)) {
        err("Can't find starting state in states provided!");
    }
    return state2Idx.get(startingState);
}

function formatAcceptingStates (givenAcceptingStates, state2Idx) {
    let acceptingStates = new Set();
    for (var i = 0; i < givenAcceptingStates.length; i++) {
        if (!state2Idx.has(givenAcceptingStates[i])) {
            err("Can't find accepting state \"" + givenAcceptingStates[i] + "\" in states provided!"); 
        }
        if (acceptingStates.has(state2Idx.get(givenAcceptingStates[i]))) {
            err("Duplicate accepting state given!");
        }
        acceptingStates.add(state2Idx.get(givenAcceptingStates[i]));
    }
    return acceptingStates;
}

class DFA {
    constructor (states, alphabet, delta, startingState, acceptingStates) {
        var res;
        res = formatStates(states);
        this.states = res[0];
        var state2Idx = res[1];
        res = formatAlphabet(alphabet);
        this.alphabet = res[0];
        var letter2Idx = res[1];
        this.delta = formatDeltaGivenNameMatrix(delta, state2Idx, letter2Idx);
        this.startingState = formatStartingState(startingState, state2Idx);
        this.acceptingStates = formatAcceptingStates(acceptingStates, state2Idx);
    }
}

let states = ["zero", "one", "two"];
//let alphabet = ["<RESET>", "+0", "+1", "+2", "+1"];
let alphabet = ["<RESET>", "+0", "+1", "+2"];
let delta = [
    ["zero", "zero", "one", "two"],
    ["zero", "one", "two", "zero"],
    ["zero", "two", "zero", "one"],
];
let d = new DFA(states, alphabet, delta, "zero", ["one"]);
console.log("youv'e reached the end !");