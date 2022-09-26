class Vector {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.recalculateMagnitude();
    }
    recalculateMagnitude () {
        this.magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normalize () {
        return new Vector(this.x / this.magnitude, this.y / this.magnitude);
    }
    scale (k) {
        return new Vector(k * this.x, k * this.y);
    }
    parallelOfMagnitude (m) {
        let u = this.normalize();
        return u.scale(m);
    }
}