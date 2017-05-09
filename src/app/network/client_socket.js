var net = require('net');
var CustomDataWrapper = require("../io/custom_data_wrapper.js").CustomDataWrapper;
var NetworkMessage = require("./network_message");
var arrayBufferToBuffer = require('arraybuffer-to-buffer');
var Processor = require("./processor");
var ByteArray = require("../io/bytearray.js");

class ClientSocket {
    constructor(bot) {
        this.bot = bot;
        this.socket = new net.Socket();
        this.register();
    }

    close() {
        this.socket.end();
    }

    register() {
        var self = this;
        this.socket.on('data', function(data){
            try {
                var buffer = new CustomDataWrapper(toArrayBuffer(data));
                while(buffer.bytesAvailable > 0) {
                    self.processPart(buffer);
                }
            }
            catch (ex) {
                console.log(ex);
                self.bot.log("Can't parse properly packet client");
            }
        });

        this.socket.on('end', function(data){
            try {
                self.bot.log("Client disconnected");
            }
            catch (ex) {
                self.bot.log("Can't disconnect properly client");
            }
        });

        this.socket.connect(5555, '213.248.126.39', function() {
            self.bot.log("Bot is now connected to server !");
            self.bot.is_connected = true;
        });
    }

    processPart(buffer) {
        var self = this;

        var header = buffer.readShort();
        var messageId = header >> 2;
        var typeLen = header & 3;
        var messageLen = NetworkMessage.getPacketLength(buffer, typeLen);
        this.bot.log("Received data (messageId: " + messageId + ", len: " + messageLen + ", real len: " + buffer.data.length + ")");
        var b = arrayBufferToBuffer(buffer.data.buffer);
        var messagePart = null;
        messagePart = b.slice(buffer.position, buffer.position + messageLen);
        Processor.handle(this.bot, messageId, new CustomDataWrapper(toArrayBuffer(messagePart)));
        buffer.position = buffer.position + messageLen;
    }

    send(packet) {
        try {
            console.log(packet);
            packet.serialize();
            var messageBuffer = new CustomDataWrapper(new ByteArray());
            var offset = NetworkMessage.writePacket(messageBuffer, packet.messageId, packet.buffer._data);
            var b = arrayBufferToBuffer(messageBuffer.data.buffer);
            console.log("Offset: " + offset);
            var finalBuffer = b.slice(0, packet.buffer._data.write_position + offset);
            this.socket.write(finalBuffer);
            this.bot.log("Sended packet '" + packet.constructor.name + "' (id: " + packet.messageId + ", packetlen: " + packet.buffer._data.write_position + ", len: " + finalBuffer.length + " -- " + b.length + ")");
        }
        catch (ex) {
            console.log(ex);
            this.bot.log("Can't send properly packet client");
        }
    }
};

module.exports = ClientSocket;