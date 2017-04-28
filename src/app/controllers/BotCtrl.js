angular.controller('BotCtrl', function ($scope, $rootScope, BotManager, $stateParams) {
    // check id value from $stateParams
        console.log("bot[" + $stateParams.id + "]");
        $scope.bot = BotManager.bots[$stateParams.id];
        
    });