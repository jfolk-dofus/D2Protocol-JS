var ClientSocket = require('../network/client_socket.js').ClientSocket;
var Bot = require("../bot.js");

Alpha.angular.service('BotManager', function (NetworkManager) {
    this.bots = [];

    this.createBot = function () {
        var bot = new Bot();
        this.bots.push(bot);
        return bot;
    };
});