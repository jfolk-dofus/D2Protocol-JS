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
        this.salt = buffer.readUTF();
        var length = buffer.readVarInt();
        this.key = new Uint8Array(length);
        for (var i = 0 ; i < length ; i++) {
            this.key[i] = buffer.readByte();
        }
    }
}

class IdentificationMessage extends ProtocolMessage {

    constructor() {
        super(4);
    }

    deserialize(buffer) {
        var flag1 = buffer.readByte();
        this.autoconnect = IO.BooleanByteWrapper.getFlag(flag1, 0);
        this.useCertificate = IO.BooleanByteWrapper.getFlag(flag1, 1);
        this.useLoginToken = IO.BooleanByteWrapper.getFlag(flag1, 2);
        this.version = new Types.VersionExtended();
        this.version.deserialize(buffer);
        this.lang = buffer.readUTF();
        var len1 = buffer.readVarUhShort();
        this.credentials = buffer.readUTF();
        this.password = buffer.readUTF();
        this.serverId = buffer.readShort();
    }

    // TODO do serialize
}

module.exports = {
    ProtocolMessage: ProtocolMessage,
    ProtocolRequiredMessage: ProtocolRequiredMessage,
    HelloConnectMessage: HelloConnectMessage,
    IdentificationMessage: IdentificationMessage,
    withId: {
        1: ProtocolRequiredMessage,
        3: HelloConnectMessage,
        4: IdentificationMessage
    }
}