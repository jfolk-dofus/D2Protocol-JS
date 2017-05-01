var CustomDataWrapper = require("../io/custom_data_wrapper.js").CustomDataWrapper;

class ProtocolMessage {
    constructor(messageId) {
        this.messageId = messageId;
        this.buffer = new CustomDataWrapper();
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

    deserialize(buffer) {
        this.requiredVersion = buffer.readInt();
        this.currentVersion = buffer.readInt();
    }
};

class HelloConnectMessage extends ProtocolMessage {
    constructor(salt, key) {
        super(3);
        this.salt = salt;
        this.key = key;
    }

    serialize() {
        this.buffer.writeUTF(this.salt);
        this.buffer.writeVarInt(this.key);
        for (var i = 0; i < 303; i++) {
            this.buffer.writeByte(i);
        }
    }

    deserialize(buffer) {
        console.log(buffer);
        this.salt = buffer.readUTF();
        var length = buffer.readVarInt();
        // this.key = buffer.slice(buffer.position, buffer.position + length); // FIX THIS, READ KEY AS BUFFER
    }
}

module.exports = {
    ProtocolMessage: ProtocolMessage,
    ProtocolRequiredMessage: ProtocolRequiredMessage,
    HelloConnectMessage: HelloConnectMessage,
    withId: {
        1: ProtocolRequiredMessage,
        3: HelloConnectMessage
    }
}