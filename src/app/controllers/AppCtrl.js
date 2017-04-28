var remote = require("electron").remote;

angular.controller('AppCtrl', function ($rootScope, BotManager, NetworkManager) { // ce controlleur n'est accessible que si tu es connecté (je bypass la connexion pour l'instant, mais dans ce contexte tu es secure)
        $rootScope.close = function () {
             remote.getCurrentWindow().close();
        };

        // en gros, le $scope c'est la variable qui sers pour le contexte du controller et de la page (la page html)/
        // je vais te montrer
        var mitm_server = NetworkManager.createMITMServer();
        var bot = BotManager.createBot(); // bypass
        BotManager.startBot(bot); // tu peux tout commit pdt que je vois la suite
    });