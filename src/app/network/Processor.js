var AuthHandler = require("./handlers/AuthHandler");
var ProtocolMessage = require("../protocol/Protocol.js");

class Processor {
     static handle(bot, messageId, buffer) {
        var handler = Processor.HANDLERS[parseInt(messageId)];
        if(handler != null) {
            var packet = new handler.message();
            bot.log("Process message '" + packet.constructor.name + "'");
            packet.deserialize(buffer);
            handler.handler(bot, packet);
        }
        else {
            bot.error("Handler not found for messageId: " + messageId);
           // client.send(new ProtocolMessage.BasicNoOperationMessage());
        }
    }

    static get HANDLERS() {
        return {
            1: { message: ProtocolMessage.ProtocolRequiredMessage, handler: AuthHandler.handleProtocolRequiredMessage },
            3: { message: ProtocolMessage.HelloConnectMessage, handler: AuthHandler.handleHelloConnectMessage }
        };
    }
}

module.exports = Processor;