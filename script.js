let radius = 50;
let goodFont = "20px sans-serif";

function getCanvas () {
    return document.getElementsByTagName("canvas")[0];
}

function getContext () {
    return canvas.getContext("2d");
}

function drawState (ctx, name, x, y) {
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();

    //ctx.textAlign = "center";
    //ctx.textBaseline = "middle";
    //ctx.font = goodFont;
    ctx.fillText(name, x, y);
}

function getCanvasCoordinates (canvas, e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    return [mouseX, mouseY];
}

function handleMouseUp (e, canvas, ctx) {
    let [xCoord, yCoord] = getCanvasCoordinates(canvas, e);
    drawState(ctx, "test", xCoord, yCoord);
}

const canvas = getCanvas();
const ctx = getContext(canvas);
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = goodFont;

canvas.addEventListener("mouseup", function (e) {
    handleMouseUp(e, canvas, ctx);
});