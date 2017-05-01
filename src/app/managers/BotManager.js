var ClientSocket = require('../network/ClientSocket.js').ClientSocket;

angular.service('BotManager', function (NetworkManager) {
        this.bots = [];

        this.createBot = function() {
            var bot = {
                account: {
                    username: "test",
                    password: "test"
                },
                connection_mode: "FULL_SOCKET",
                log: function(text) {
                    bot.emit("log_info", text);
                }
            };
            Events(bot); // wrap bot into event interface
            bot.on("receive_message", function(data) {
                //bot.log_info("receive message");
            });
            return bot;
        };

        this.startBot = function(bot) {
            // create MITM server
            // wait user connection
            // when connected, create MITM client, to connect to dofus server
            // in parallel, create a full socket mode
            switch (bot.connection_mode) {
                case "MITM":
                    break;

                case "FULL_SOCKET":
                    bot.socket = new ClientSocket(bot);
                    break;
            }
            // att je réfléchis
            this.bots.push(bot);
        }
    });