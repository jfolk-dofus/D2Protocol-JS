angular.controller('BotCtrl', function ($scope, $rootScope, BotManager, $stateParams) {
        // check id value from $stateParams
        $scope.bot = BotManager.bots[$stateParams.id];
        $scope.bot.on("log_info", function(text) {
            $scope.console_text += "[INFO] " + text + "\n";
            $scope.$apply();
        });
        $scope.$on("$destroy", function() {
            $scope.bot.off("log_info");
        });
        $scope.console_text = "";
        $scope.botConnect = function() {
            $scope.bot.connect();
        };
        $scope.botDisconnect = function() {
            $scope.bot.disconnect();
        };
    });