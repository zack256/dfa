const goodRadius = 50;

function drawCircle (xCoord, yCoord, radius, fillColor=null) {
    ctx.beginPath();
    ctx.ellipse(xCoord, yCoord, radius, radius, 0, 0, 2 * Math.PI);
    if (fillColor != null) {
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.fillStyle = "black";
    }
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

function drawProtoDFA () {
    var protoState;
    for (var i = 0; i < protoStates.length; i++) {
        protoState = protoStates[i];

        if (i == selectedStateIdx) {
            drawCircle(protoState.x, protoState.y, protoState.radius, "lightblue");    
        } else {
            drawCircle(protoState.x, protoState.y, protoState.radius);    
        }
    
        ctx.fillText(protoState.name, protoState.x, protoState.y);
    }
}

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //drawDFA(dfa);
    drawProtoDFA();

    window.requestAnimationFrame(draw);
}