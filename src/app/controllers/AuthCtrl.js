angular.module('Alpha.auth.controllers', [])
    .controller('AuthCtrl', function ($rootScope) {

        $rootScope.close = function () {
            remote.getCurrentWindow().close();
        };
    });