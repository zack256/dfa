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

function distance (pos1, pos2) {
    let [x1, y1] = pos1;
    let [x2, y2] = pos2;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
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