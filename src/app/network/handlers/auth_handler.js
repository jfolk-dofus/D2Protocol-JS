var aes = require("aes-js");
var Protocol = require("../../protocol/protocol.js");
var crypto = require('crypto');
var ByteBuffer = require('../../io/bytearray');

class AuthHandler {
    static handleHelloConnectMessage(bot, packet) {
        var publicKey = "-----BEGIN PUBLIC KEY-----\nMIIBUzANBgkqhkiG9w0BAQEFAAOCAUAAMIIBOwKCATIAgucoka9J2PXcNdjcu6CuDmgteIMB+rih2UZJIuSoNT/0J/lEKL/W4UYbDA4U/6TDS0dkMhOpDsSCIDpO1gPG6+6JfhADRfIJItyHZflyXNUjWOBG4zuxc/L6wldgX24jKo+iCvlDTNUedE553lrfSU23Hwwzt3+doEfgkgAf0l4ZBez5Z/ldp9it2NH6/2/7spHm0Hsvt/YPrJ+EK8ly5fdLk9cvB4QIQel9SQ3JE8UQrxOAx2wrivc6P0gXp5Q6bHQoad1aUp81Ox77l5e8KBJXHzYhdeXaM91wnHTZNhuWmFS3snUHRCBpjDBCkZZ+CxPnKMtm2qJIi57RslALQVTykEZoAETKWpLBlSm92X/eXY2DdGf+a7vju9EigYbX0aXxQy2Ln2ZBWmUJyZE8B58CAwEAAQ==\n-----END PUBLIC KEY-----";

        var salt = packet.salt;
        while (salt.length < 32) {
            salt += " ";
        }

        var buffer = new ByteBuffer();
        buffer.writeUTFBytes(salt);
        buffer.writeBytes(new Int8Array(32), 0, 32);
        buffer.writeByte(bot.account.username.length);
        buffer.writeUTFBytes(bot.account.username);
        buffer.writeUTFBytes(bot.account.password);
        buffer = buffer.toBuffer(buffer.write_position);

        var credentials = crypto.publicEncrypt(publicKey, buffer);
        var version = new Protocol.VersionExtended(2, 41, 1, 120264, 1, Protocol.BuildTypeEnum.RELEASE, 1, 1);
        var identificationMessage = new Protocol.IdentificationMessage(version, "fr", credentials, 1, false, false, false, 0, [0]);
        bot.send(identificationMessage);
    }

    static handleProtocolRequiredMessage(bot, packet) {
        console.log(packet);
    }
}
module.exports = AuthHandler;