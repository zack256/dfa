class StrictMap extends Map {
    add (key, value) {
        if (super.has(key)) {
            err("Duplicate key in Strict map: " + key);
        }
        super.set(key, value);
    }
}