function checkProtoDFA () {
    // checks if the proto stuff will make a valid DFA.
    if (protoStateMap.size == 0) {
        err("# of states cannot be 0.");
    }
    let startingStateID = getStartingStateValue();
    if (startingStateID == "0") {
        err("No starting state provided!");
    }
    let startingState = protoStateMap.get(Number(startingStateID));
    let deltaFunc = new StrictMap();
    for (var i = 0; i < protoStateList.length; i++) {
        let protoState = protoStateMap.get(protoStateList[i]);
        let subFunc = new StrictMap();
        for (const [stateID, arrowID] of protoState.outgoing.entries()) {
            let letterID = protoArrowMap.get(arrowID).letterID;
            subFunc.set(letterID, arrowID);
        }
        if (subFunc.size != protoLetterMap.size) {
            err('# Transitions for state "' + protoState.name + '" is invalid!');   // maybe put more detail
        }
        deltaFunc.set(protoState.id, subFunc);
    }
    console.log("All checks passed!");
}