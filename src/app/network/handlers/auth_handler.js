var aes = require("aes-js");
var Protocol = require("../../protocol/protocol.js");

class AuthHandler {
    static handleHelloConnectMessage(bot, packet) {
        console.log(packet);

        var salt = packet.salt;
        var key = packet.key;
        var rsa = new JSEncrypt();
        var publicKey = "-----BEGIN PUBLIC KEY-----" + arrayBufferToBase64(packet.key.reverse()) + "-----END PUBLIC KEY-----";
        rsa.setPublicKey(publicKey);
        console.log(publicKey);

        var version = new Protocol.VersionExtended(2, 41, 1, 120264, 1, Protocol.BuildTypeEnum.RELEASE, 1, 1);
        var credentials = rsa.encrypt("test" + salt + "test");
        console.log(credentials);
        var identificationMessage = new Protocol.IdentificationMessage(version, "fr", credentials, 1, false, false, false, 0, [0]);
        bot.send(identificationMessage);
    }

    static handleProtocolRequiredMessage(bot, packet) {
        console.log(packet);
    }
}

module.exports = AuthHandler;