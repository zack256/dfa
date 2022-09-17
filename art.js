const goodRadius = 50;

function drawCircle (xCoord, yCoord, radius) {
    ctx.beginPath();
    ctx.ellipse(xCoord, yCoord, radius, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
}

function getRandomStateCoords () {
    // Prevents bleeding off edge of canvas.
    let width = canvas.width;
    let height = canvas.height;
    let x = getRandomNumber(goodRadius, width - goodRadius);
    let y = getRandomNumber(goodRadius, height - goodRadius);
    return [x, y];
}
/**
function drawDFA (dfa) {
    if (dfa == null) return;
    var state;
    for (var i = 0; i < dfa.states.length; i++) {
        state = dfa.states[i];

        drawCircle(state.drawProperties.x, state.drawProperties.y, state.drawProperties.radius);        
        ctx.fillText(state.name, state.drawProperties.x, state.drawProperties.y);
    }
}
**/

function drawProtoDFA () {
    var protoState;
    for (var i = 0; i < protoStates.length; i++) {
        protoState = protoStates[i];

        drawCircle(protoState.x, protoState.y, protoState.radius);        
        ctx.fillText(protoState.name, protoState.x, protoState.y);
    }
}

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //drawDFA(dfa);
    drawProtoDFA();

    window.requestAnimationFrame(draw);
}