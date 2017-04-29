<typeDeps>

class ProtocolMessage {
    constructor(messageId) {
        this.messageId = messageId;
        this.buffer = new IO.CustomDataWrapper();
    }
};

<superDep>

class <classname> extends ProtocolMessage {
    constructor(requiredVersion, currentVersion) {
        super(<id>);
        <vars>
    }

    serialize() {
        <serialize>
    }

    deserialize() {
        <deserialize>
    }
};

module.exports = {
    ProtocolMessage: ProtocolMessage,
    <classname>: <classname>,
    withId: {
        <id>: <classname>
    }
}