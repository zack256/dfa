class ProtoState {
    constructor (id, idx, name, pos, radius, isAccepting) {
        this.id = id;
        this.idx = idx;
        this.name = name;
        this.pos = pos;
        this.radius = radius;
        this.isAccepting = isAccepting;
        this.outgoing = new StrictMap();
        this.incoming = new StrictMap();
    }
}