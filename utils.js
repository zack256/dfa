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