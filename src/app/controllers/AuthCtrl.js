angular.controller('AuthCtrl', function ($rootScope) {

        $rootScope.close = function () {
            remote.getCurrentWindow().close();
        };
    });