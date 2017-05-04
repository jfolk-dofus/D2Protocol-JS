var aes = require("aes-js");
var Protocol = require("../../protocol/protocol.js");
var crypto = require('crypto');

function bufferToBase64(buf) {
    var subuf = new Uint8Array(buf);
    var binstr = Array.prototype.map.call(subuf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}

class AuthHandler {
    static handleHelloConnectMessage(bot, packet) {
        console.log(packet);

        var salt = packet.salt;
        var key = packet.key;

        var publicKey = "-----BEGIN PUBLIC KEY-----\n";
        publicKey += bufferToBase64(packet.key) + "\n";
        publicKey += "-----END PUBLIC KEY-----";
     //   crt = ursa.createPublicKey(publicKey);

        console.log(publicKey);

        var version = new Protocol.VersionExtended(2, 41, 1, 120264, 1, Protocol.BuildTypeEnum.RELEASE, 1, 1);
        var credentials =   crypto.publicEncrypt(publicKey, new Buffer("test" + salt + "test"));
        console.log(credentials);
        var identificationMessage = new Protocol.IdentificationMessage(version, "fr", credentials, 1, false, false, false, 0, [0]);
        bot.send(identificationMessage);
    }

    static handleProtocolRequiredMessage(bot, packet) {
        console.log(packet);
    }
}

module.exports = AuthHandler;