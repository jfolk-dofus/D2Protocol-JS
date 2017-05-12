Alpha.angular.controller('DashboardCtrl', function ($scope, $rootScope, BotManager) {
    $scope.loadNewBot = function() { // only for dev
        var bot = BotManager.createBot();
        $rootScope.bots = BotManager.bots;
    };
});