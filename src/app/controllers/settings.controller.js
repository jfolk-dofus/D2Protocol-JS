var settings = require('electron-settings');

Alpha.angular.controller('SettingsCtrl', function ($scope, $rootScope, BotManager) {
    $scope.debug = settings.get("debug", false);
    $scope.$watch('debug', function(newValue, oldValue) {
        settings.set('debug', newValue);
    });
});