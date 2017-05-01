var remote = require("electron").remote;

angular.controller('AppCtrl', function ($rootScope, BotManager, NetworkManager) { // ce controlleur n'est accessible que si tu es connecté (je bypass la connexion pour l'instant, mais dans ce contexte tu es secure)
        $rootScope.close = function () {
             remote.getCurrentWindow().close();
        };

        // en gros, le $scope c'est la variable qui sers pour le contexte du controller et de la page (la page html)/
        // je vais te montrer
        var bot = BotManager.createBot(); // bypass
        $rootScope.bots = BotManager.bots; // add watcher to this
    });