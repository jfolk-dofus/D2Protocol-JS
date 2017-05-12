var remote = require("electron").remote;

Alpha.angular.controller('AppCtrl', function ($rootScope, BotManager, NetworkManager) {
    $rootScope.close = function () {
        remote.getCurrentWindow().close();
    };
    $rootScope.bots = BotManager.bots; // add watcher to this
});