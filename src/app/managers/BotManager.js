angular.service('BotManager', function () {
        this.bots = [];

        this.createBot = function() {
            var bot = {
                account: {
                    username: "test",
                    password: "test"
                },
                connection_mode: "MITM"
            };
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
                    break;
            }
            // att je réfléchis
            this.bots.push(bot);
        }
    });