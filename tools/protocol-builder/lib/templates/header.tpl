var CustomDataWrapper = require("../io/custom_data_wrapper.js").CustomDataWrapper;
var BooleanByteWrapper = require("../io/custom_data_wrapper.js").BooleanByteWrapper;

class ProtocolMessage {
    constructor(messageId) {
        this.messageId = messageId;
        this.buffer = new CustomDataWrapper();
    }
};
module.exports.ProtocolMessage = ProtocolMessage;

class ProtocolType {
    constructor(messageId) {
        this.messageId = messageId;
        this.buffer = new CustomDataWrapper();
    }
};
module.exports.ProtocolType = ProtocolType;

module.exports.messages = [];
module.exports.types = [];