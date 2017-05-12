var aes = require("aes-js");
var Protocol = require("../../protocol/protocol.js");
var crypto = require('crypto');
var ByteBuffer = require('../../io/bytearray');
var ursa = require('../../../assets/libs/ursa/lib/ursa.js');

var _key = "-----BEGIN PUBLIC KEY-----\n" +
    "MIIBUzANBgkqhkiG9w0BAQEFAAOCAUAAMIIBOwKCATIAgucoka9J2PXcNdjcu6CuDmgteIMB+rih\n" +
    "2UZJIuSoNT/0J/lEKL/W4UYbDA4U/6TDS0dkMhOpDsSCIDpO1gPG6+6JfhADRfIJItyHZflyXNUj\n" +
    "WOBG4zuxc/L6wldgX24jKo+iCvlDTNUedE553lrfSU23Hwwzt3+doEfgkgAf0l4ZBez5Z/ldp9it\n" +
    "2NH6/2/7spHm0Hsvt/YPrJ+EK8ly5fdLk9cvB4QIQel9SQ3JE8UQrxOAx2wrivc6P0gXp5Q6bHQo\n" +
    "ad1aUp81Ox77l5e8KBJXHzYhdeXaM91wnHTZNhuWmFS3snUHRCBpjDBCkZZ+CxPnKMtm2qJIi57R\n" +
    "slALQVTykEZoAETKWpLBlSm92X/eXY2DdGf+a7vju9EigYbX0aXxQy2Ln2ZBWmUJyZE8B58CAwEA\n" +
    "AQ==\n" +
    "-----END PUBLIC KEY-----";

function generateAESKey() {
    var key = [];
    for (let i = 0; i < 32; i++) {
        key[i] = Math.floor(Math.random() * 256);
    }
}

class AuthHandler {
    static handleHelloConnectMessage(bot, packet) {
        var salt = packet.salt;
        while (salt.length < 32) {
            salt += " ";
        }

        var publicKey = ursa.createPublicKey(new Buffer(_key));

        if (!ursa.isPublicKey(publicKey)) {
            return (null);
        }

        var decryptedPublicKey = publicKey.publicDecrypt(packet.key, 'binary', 'base64');

        if (decryptedPublicKey === null) {
            return (null);
        }

        var formatedBase64Key = "";

        for (var i = 0; i < decryptedPublicKey.length; ++i) {
            formatedBase64Key += decryptedPublicKey[i];
            if ((i + 1) % 76 === 0 && i != 0) {
                formatedBase64Key += "\n";
            }
        }
        formatedBase64Key = "-----BEGIN PUBLIC KEY-----\n" + formatedBase64Key + "\n-----END PUBLIC KEY-----";

        var decryptedPublicKey = ursa.createPublicKey(formatedBase64Key);

        if (!ursa.isPublicKey(decryptedPublicKey)) {
            return (null);
        }

        var buffer = new ByteBuffer();
        buffer.writeUTFBytes(salt);
        buffer.writeBytes(new Uint8Array(generateAESKey()), 0, 32);
        buffer.writeByte(bot.account.username.length);
        buffer.writeUTFBytes(bot.account.username);
        buffer.writeUTFBytes(bot.account.password);
        buffer = buffer.toBuffer(buffer.write_position);

        var encryptedData = decryptedPublicKey.encrypt(buffer, 'binary', 'hex', ursa.RSA_PKCS1_PADDING);

        var version = new Protocol.VersionExtended(2, 41, 1, 120264, 1, Protocol.BuildTypeEnum.RELEASE, 1, 1);
        var identificationMessage = new Protocol.IdentificationMessage(version, "fr", (new Int8Array(new Buffer(encryptedData, 'hex'))), 0, false, false, false, 0, [0]);
        bot.send(identificationMessage);
    }

    static handleProtocolRequired(bot, packet) {
    }

    static handleLoginQueueStatusMessage(bot, packet) {
        bot.log("Vous êtes " + packet.position + " sur " + packet.total + " dans la file d'attente.");
    }
}

module.exports = AuthHandler;