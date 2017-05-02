class <classname> extends <heritage> {
    constructor(<constructor>) {
        <super>
        <vars>
    }

    serialize() {
        <serialize>
    }

    deserialize(buffer) {
        <deserialize>
    }
};
module.exports.<classname> = <classname>;
module.exports.types[<id>] = <classname>;