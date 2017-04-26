angular.module('Alpha.app.controllers', [])
    .controller('AppCtrl', function ($rootScope) {
        console.log("appctrl")
        $scope.close = function () {
            remote.getCurrentWindow().close();
        };
    });