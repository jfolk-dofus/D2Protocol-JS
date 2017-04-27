angular.module('Alpha.app.controllers', [])
    .controller('AppCtrl', function ($rootScope) {
    console.log("yeah");
     $rootScope.close = function () {
            remote.getCurrentWindow().close();
        };
    });

   