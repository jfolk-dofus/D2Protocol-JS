

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
        .state('app.bot', {
            url: "/bot/:id",
            templateUrl: "app/views/app/bot.html",
            controller: "BotCtrl"
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
}).directive('showtab',
function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function(e) {
                e.preventDefault();
                $(element).tab('show');
            });
        }
    };
});

require("./app/controllers/AppCtrl.js");
require("./app/controllers/BotCtrl.js");
require("./app/controllers/AuthCtrl.js");
require("./app/controllers/DashboardCtrl.js");
require("./app/network/NetworkMessage.js");
require("./app/network/ClientSocket.js");
require("./app/protocol/ProtocolMessage.js");
require("./app/managers/BotManager.js");
require("./app/managers/NetworkManager.js");
require("./app/io/bytearray.js");
require("./app/io/custom_data_wrapper.js");
