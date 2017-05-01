class AuthHandler {
    static handleHelloConnectMessage(bot, packet) {
        console.log(packet);
    }

    static handleProtocolRequiredMessage(bot, packet) {
        console.log(packet);
    }
}

module.exports = AuthHandler;