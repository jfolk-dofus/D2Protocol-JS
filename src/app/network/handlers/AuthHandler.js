var aes = require("aes-js");

class AuthHandler {
    static handleHelloConnectMessage(bot, packet) {
        var salt = packet.salt;
        var key = packet.key;
        var rsa = new JSEncrypt();
        rsa.setPublicKey(packet.key);
        // encrypt.encrypt();
        console.log(packet);
    }

    static handleProtocolRequiredMessage(bot, packet) {
        console.log(packet);
    }
}

module.exports = AuthHandler;