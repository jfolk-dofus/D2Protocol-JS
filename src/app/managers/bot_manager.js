var ClientSocket = require('../network/client_socket.js').ClientSocket;
var Bot = require("../bot.js");

Alpha.angular.service('BotManager', function (NetworkManager) {
    this.bots = [];

    this.createBot = function (account) {
        var bot = new Bot(account);
        this.bots.push(bot);
        return bot;
    };
});