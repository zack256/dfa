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

function drawDFA (dfa) {
    if (dfa == null) return;
    var state, xCoord, yCoord;
    for (var i = 0; i < dfa.states.length; i++) {
        state = dfa.states[i];

        drawCircle(state.xCoord, state.yCoord, goodRadius);        
        ctx.fillText(state.name, state.xCoord, state.yCoord);
    }
}

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawDFA(dfa);

    window.requestAnimationFrame(draw);
}