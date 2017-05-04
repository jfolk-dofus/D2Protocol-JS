var AuthHandler = require("./handlers/auth_handler");
var Protocol = require("../protocol/protocol.js");

class Processor {
     static handle(bot, messageId, buffer) {
         var packet = new (Protocol.messages[parseInt(messageId)])();
         if (packet != null) {
            bot.log("Process message '" + packet.constructor.name + "'");
            try {
                packet.deserialize(buffer);
            } catch (exception) {
                console.log(exception);
                bot.err("Cannot deserialize message '" + packet.constructor.name + "'");
            }
            var handler = this.HANDLERS[parseInt(messageId)].handler;
            if (handler == null)
                bot.err("Cannot handle this message '" + packet.constructor.name + "'");
            else
                handler(bot, packet)
        }
        else {
            bot.err("Handler not found for messageId: " + messageId);
            bot.send(new Protocol.BasicNoOperationMessage());
        }
    }

    static get HANDLERS() {
        return {
            1: { message: Protocol.ProtocolRequiredMessage, handler: AuthHandler.handleProtocolRequiredMessage },
            3: { message: Protocol.HelloConnectMessage, handler: AuthHandler.handleHelloConnectMessage }
        };
    }
}

module.exports = Processor;