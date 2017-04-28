angular.controller('DashboardCtrl', function ($scope, $rootScope, BotManager) {
    $scope.loadNewBot = function() { // only for dev
        var bot = BotManager.createBot();
        BotManager.startBot(bot); 
        console.log($rootScope);
        $rootScope.bots = BotManager.bots;
    };
});