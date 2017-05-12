var AuthHandler = require("./handlers/auth_handler");
var Protocol = require("../protocol/protocol.js");

class Processor {
    static handle(bot, messageId, buffer) {
        var packet = new (Protocol.messages[parseInt(messageId)])();
        if (packet != null) {
            bot.debug("Process message '" + packet.constructor.name + "'");
            try {
                packet.deserialize(buffer);
            } catch (exception) {
                console.log(exception);
                bot.err("Cannot deserialize message '" + packet.constructor.name + "'");
            }
            let handled = false;
            for (let i = 0; i < this.HANDLERS.length; i++) {
                let handler = this.HANDLERS[i]["handle" + packet.constructor.name];
                if (typeof handler != 'undefined') {
                    handler(bot, packet);
                    handled = true;
                }
            }
            if (!handled)
                bot.err("Cannot handle this message '" + packet.constructor.name + "'");
        }
        else {
            bot.err("Message not found for messageId: " + messageId);
            bot.send(new Protocol.BasicNoOperationMessage());
        }
    }

    static get HANDLERS() {
        return [
            AuthHandler
        ];
    }
}
module.exports = Processor;