const goodRadius = 50;
const goodInnerRadiusFrac = 0.85;

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

function drawLine (x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
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

function drawProtoStates () {
    var protoState;
    for (var i = 0; i < protoStates.length; i++) {
        protoState = protoStates[i];

        if (i == selectedStateIdx) {
            drawCircle(protoState.pos.x, protoState.pos.y, protoState.radius, "lightblue");
        } else {
            drawCircle(protoState.pos.x, protoState.pos.y, protoState.radius, "white");
        }

        if (protoState.isAccepting) {
            drawCircle(protoState.pos.x, protoState.pos.y, protoState.radius * goodInnerRadiusFrac);
        }
    
        ctx.fillText(protoState.name, protoState.pos.x, protoState.pos.y);
    }
}

function drawProtoArrows () {
    var arrowIdxs, protoState1, protoState2;
    for (var i = 0; i < protoArrows.length; i++) {
        arrowIdxs = protoArrows[i];
        protoState1 = protoStates[arrowIdxs[0]];
        protoState2 = protoStates[arrowIdxs[1]];
        drawLine(protoState1.pos.x, protoState1.pos.y, protoState2.pos.x, protoState2.pos.y);
    }
}

function drawCurrentArrow () {
    if (arrowOrigin == -1) return;
    let protoState = protoStates[arrowOrigin];
    drawLine(protoState.pos.x, protoState.pos.y, mousePos[0], mousePos[1]);
}

function drawProtoDFA () {
    drawProtoArrows();
    drawProtoStates();
    drawCurrentArrow();
}

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawProtoDFA();

    window.requestAnimationFrame(draw);
}