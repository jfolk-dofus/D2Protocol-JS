var ClientSocket = require('../network/ClientSocket.js').ClientSocket;
var Bot = require("../Bot.js");

angular.service('BotManager', function (NetworkManager) {
        this.bots = [];

        this.createBot = function() {
            var bot = new Bot();
            bot.on("receive_message", function(data) {
                //bot.log_info("receive message");
            });
            this.bots.push(bot);
            return bot;
        };
    });