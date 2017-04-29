class ProtocolMessage {
    constructor(messageId) {
        this.messageId = messageId;
        this.buffer = new IO.CustomDataWrapper();
    }
};

class ProtocolRequiredMessage extends ProtocolMessage {
    constructor(requiredVersion, currentVersion) {
        super(1);
        this.requiredVersion = requiredVersion;
        this.currentVersion = currentVersion;
    }

    serialize() {
        this.buffer.writeInt(this.requiredVersion);
        this.buffer.writeInt(this.currentVersion);
    }

    deserialize() {
        this.requiredVersion = this.buffer.readInt();
        this.currentVersion = this.buffer.readInt();
    }
};

module.exports = {
    ProtocolMessage: ProtocolMessage,
    ProtocolRequiredMessage: ProtocolRequiredMessage,
    withId: {
        1: ProtocolRequiredMessage
    }
}