class ProtoState {
    constructor (name, pos, radius, isAccepting) {
        this.name = name;
        this.pos = pos;
        this.radius = radius;
        this.isAccepting = isAccepting;
        this.outgoing = new StrictMap();
        this.incoming = new StrictMap();
    }
}