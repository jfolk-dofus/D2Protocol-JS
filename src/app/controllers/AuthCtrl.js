angular.module('Alpha.auth.controllers', [])
    .controller('AuthCtrl', function ($rootScope) {

        $scope.close = function () {
            remote.getCurrentWindow().close();
        };
    });