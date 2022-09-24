function err (msg) {
    // replacing the throws.
    console.error(msg);
    process.exit(1);
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

function pop (arr, idx) {
    let l = arr.splice(idx, 1);
    return l[0];
}