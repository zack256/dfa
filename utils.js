function err (msg) {
    // replacing the throws.
    console.error(msg);
    process.exit(1);
}

function alertAndErr (msg) {
    alert(msg);
    err(msg);
}

function getRandomNumber (low, high) {
    // [low, high)
    let delta = high - low;
    return low + Math.random() * delta;
}

function getRandom2DecimalDigitNumber (low, high) {
    // Not perfect, might not round 0.5 stuff right
    let num = getRandomNumber(low, high);
    return Math.round(num * 100) / 100;
}

function distance (pos1, pos2) {
    return Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2);
}

function doOrbitsIntersect (pos1, pos2, radius1, radius2) {
    return distance(pos1, pos2) <= (radius1 + radius2);
}

function pointWithinRadius (planetPos, satellitePos, radius) {
    return doOrbitsIntersect(planetPos, satellitePos, radius, 0);
}

function slope (pos1, pos2) {
    return (pos2.y - pos1.y) / (pos2.x - pos1.x);
}

function degreesToRadians (theta) {
    return (theta / 180) * Math.PI;
}

function pop (arr, idx) {
    let l = arr.splice(idx, 1);
    return l[0];
}

function mod (a, b) {
    let r = a % b;
    return r < 0 ? r + b : r;
}

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}