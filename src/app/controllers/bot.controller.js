angular.controller('BotCtrl', function ($scope, $rootScope, BotManager, $stateParams, $sce) {
        // check id value from $stateParams
        $scope.bot = BotManager.bots[$stateParams.id];
        $scope.botConnect = function() {
            $scope.bot.connect();
        };
        $scope.botDisconnect = function() {
            $scope.bot.disconnect();
        };
    });