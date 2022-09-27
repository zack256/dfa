const goodRadius = 50;
const goodInnerRadiusFrac = 0.85;

const arrowTipHeight = 10;
const arrowThetaDegrees = 45;
const arrowTheta = degreesToRadians(arrowThetaDegrees);
const halfArrowTheta = arrowTheta / 2;
const showArrowTipMultiplier = 2;   // 0 if always show.
const showArrowDist = arrowTipHeight * showArrowTipMultiplier;

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

function drawLine (pos1, pos2) {
    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.stroke();
}

function drawArrow (startPos, endPos) {
    drawLine(startPos, endPos);
    let arrowLength = distance(startPos, endPos);
    if (arrowLength > showArrowDist) {
        let deltaX = endPos.x - startPos.x;
        let deltaY = endPos.y - startPos.y;
        let tipFraction = arrowTipHeight / arrowLength;
        let arrowBase = new Pos(endPos.x - tipFraction * deltaX, endPos.y - tipFraction * deltaY);
        if (deltaY != 0) {  // deltaX == 0 is fine.
            let arrowSlope = slope(startPos, endPos);
            let perpSlope = -1 * (1 / arrowSlope);
            baseVector = new Vector(1, perpSlope);
        } else {
            baseVector = new Vector(0, 1);
        }
        let halfBaseLength = arrowTipHeight * Math.tan(halfArrowTheta);
        let halfBaseVector = baseVector.parallelOfMagnitude(halfBaseLength);
        ctx.beginPath();
        ctx.moveTo(endPos.x, endPos.y);
        ctx.lineTo(arrowBase.x + halfBaseVector.x, arrowBase.y + halfBaseVector.y);
        ctx.lineTo(arrowBase.x - halfBaseVector.x, arrowBase.y - halfBaseVector.y);
        ctx.fill();
    }
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
    var id, protoState;
    for (var i = 0; i < protoStateList.length; i++) {
        id = protoStateList[i];
        protoState = protoStateMap.get(id);

        if (id == selectedStateID) {
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
    var arrowIDs, protoState1, protoState2, vec;
    for (var i = 0; i < protoArrows.length; i++) {
        arrowIDs = protoArrows[i];
        protoState1 = protoStateMap.get(arrowIDs[0]);
        protoState2 = protoStateMap.get(arrowIDs[1]);
        vec = new Vector(protoState2.pos.x - protoState1.pos.x, protoState2.pos.y - protoState1.pos.y);
        vec = vec.parallelOfMagnitude(distance(protoState1.pos, protoState2.pos) - protoState2.radius);
        //drawLine(protoState1.pos, protoState2.pos);
        drawArrow(protoState1.pos, new Pos(protoState1.pos.x + vec.x, protoState1.pos.y + vec.y));
    }
}

function drawCurrentArrow () {
    if (arrowOrigin == -1) return;
    let protoState = protoStateMap.get(arrowOrigin);
    //drawLine(protoState.pos, mousePos);
    drawArrow(protoState.pos, mousePos);
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