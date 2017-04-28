

var angular = angular.module('Alpha', [
    'ui.router'
]);

angular.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            //abstract: true,
            templateUrl: "app/views/app/layout.html",
            controller: 'AppCtrl'
        })
        .state('app.dashboard', {
            url: "/dashboard",
            templateUrl: "app/views/app/dashboard.html",
            controller: "DashboardCtrl"
        })
        .state('auth', {
            url: "/auth",
            abstract: true,
            templateUrl: "app/views/auth/layout.html",
            controller: 'AuthCtrl'
        })
        .state('auth.login', {
            url: "/login",
            templateUrl: "app/views/auth/login.html",
        });

    $urlRouterProvider.otherwise('/app/dashboard');
    //$locationProvider.html5Mode(true);
});

require("./app/controllers/AppCtrl.js");
require("./app/controllers/AuthCtrl.js");
require("./app/controllers/DashboardCtrl.js");
require("./app/services/DofusNetworkService.js");
require("./app/network/NetworkMessage.js");
require("./app/protocol/ProtocolMessage.js");
require("./app/managers/BotManager.js");
require("./app/managers/NetworkManager.js");