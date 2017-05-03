var remote = require("electron").remote;

angular.controller('AppCtrl', function ($rootScope, BotManager, NetworkManager) {
    $rootScope.close = function () {
        remote.getCurrentWindow().close();
    };
    var bot = BotManager.createBot(); // bypass
    $rootScope.bots = BotManager.bots; // add watcher to this
});