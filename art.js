const goodRadius = 50;
const goodInnerRadiusFrac = 0.85;

const arrowTipHeight = 10;
const arrowThetaDegrees = 45;
const arrowTheta = degreesToRadians(arrowThetaDegrees);
const halfArrowTheta = arrowTheta / 2;
const showArrowTipMultiplier = 2;   // 0 if always show.
const showArrowDist = arrowTipHeight * showArrowTipMultiplier;

function drawCircle (pos, radius, fillColor=null) {
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, radius, radius, 0, 0, 2 * Math.PI);
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

function drawStraightArrow (startPos, endPos) {
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

function getLoopCircleCenter (pos, radius) {
    return new Pos(pos.x + radius, pos.y - radius);
}

function drawLoopArrow (pos, radius) {
    // pos and radius are of the circle/state we're drawing a loop next to.
    // drawing a loop to the upper and right of the state.
    let loopCircleCenter = getLoopCircleCenter(pos, radius);
    let loopCircleRadius = radius;
    // Loop
    ctx.beginPath();
    ctx.arc(loopCircleCenter.x, loopCircleCenter.y, loopCircleRadius, Math.PI, Math.PI / 2); // Huh??!
    ctx.stroke();
    ctx.beginPath();
    // Arrow
    let arrowBase = new Pos(pos.x + radius + arrowTipHeight, pos.y);
    let halfArrowTipHeight = arrowTipHeight / 2;
    ctx.moveTo(pos.x + radius, pos.y);
    ctx.lineTo(arrowBase.x, arrowBase.y + halfArrowTipHeight);
    ctx.lineTo(arrowBase.x, arrowBase.y - halfArrowTipHeight);
    ctx.fill();
}

function drawDiamondInCircle (centerPos, radius) {
    ctx.beginPath();
    ctx.moveTo(centerPos.x, centerPos.y - radius);
    ctx.lineTo(centerPos.x + radius, centerPos.y);
    ctx.lineTo(centerPos.x, centerPos.y + radius);
    ctx.lineTo(centerPos.x - radius, centerPos.y);
    ctx.lineTo(centerPos.x, centerPos.y - radius);
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
    var id, protoState;
    let currentStartState = document.getElementById("startStateSelect").value;
    for (var i = 0; i < protoStateList.length; i++) {
        id = protoStateList[i];
        protoState = protoStateMap.get(id);

        if (CS[0] == "state" && id == CS[1]) {
            drawCircle(protoState.pos, protoState.radius, "lightblue");
        } else {
            drawCircle(protoState.pos, protoState.radius, "white");
        }

        if (currentStateID == id) {
            drawCircle(protoState.pos, protoState.radius, "green");
        }

        if (protoState.isAccepting) {
            drawCircle(protoState.pos, protoState.radius * goodInnerRadiusFrac);
        }
        if (protoState.id == currentStartState) {
            drawDiamondInCircle(protoState.pos, protoState.radius);
        }
    
        ctx.fillText(protoState.name, protoState.pos.x, protoState.pos.y);
    }
}

function drawProtoArrows () {
    for (let i = 0; i < protoArrowList.length; i++) {
        let protoArrow = protoArrowMap.get(protoArrowList[i]);
        let isHighlighting = (
            (CS[0] == "arrow" && protoArrow.id == CS[1]) ||
            (CS[0] == "letter" && protoArrow.letterIDs.has(CS[1]))
        );
        if (isHighlighting) {
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
        }

        if (protoArrow.originID != protoArrow.destID) {
            // Straight arrow connecting 2 diff states.
            let protoState1 = protoStateMap.get(protoArrow.originID);
            let protoState2 = protoStateMap.get(protoArrow.destID);
            let vec = new Vector(protoState2.pos.x - protoState1.pos.x, protoState2.pos.y - protoState1.pos.y);
            vec = vec.parallelOfMagnitude(distance(protoState1.pos, protoState2.pos) - protoState2.radius);
            //drawLine(protoState1.pos, protoState2.pos);
            drawStraightArrow(protoState1.pos, new Pos(protoState1.pos.x + vec.x, protoState1.pos.y + vec.y));
            //midPointPos = new Pos(protoState1.pos.x + vec.x / 2, protoState1.pos.y + vec.y / 2);
            let midPointPos = new Pos((protoState1.pos.x + protoState2.pos.x) / 2, (protoState1.pos.y + protoState2.pos.y) / 2);
            if (protoArrow.letterIDs.size != 0) {
                ctx.fillText(protoArrow.displayString, midPointPos.x, midPointPos.y);
            }
        } else {
            // Circle arrow connecting a state to itself.
            let protoState = protoStateMap.get(protoArrow.originID);
            drawLoopArrow(protoState.pos, protoState.radius);
            if (protoArrow.letterIDs.size != 0) {
                let loopCircleCenter = getLoopCircleCenter(protoState.pos, protoState.radius);
                let loopTextCenter = new Pos(loopCircleCenter.x + protoState.radius, loopCircleCenter.y - protoState.radius);
                ctx.fillText(protoArrow.displayString, loopTextCenter.x, loopTextCenter.y);
            }
        }
        if (isHighlighting) {
            ctx.strokeStyle = "black";
            ctx.fillStyle = "black";
        }
    }
}

function drawCurrentArrow () {
    if (arrowOrigin == -1) return;
    let protoState = protoStateMap.get(arrowOrigin);
    drawStraightArrow(protoState.pos, mousePos);
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