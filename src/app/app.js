

var angular = angular.module('Alpha', [
    'ui.router'
]);

angular.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $sceProvider) {
    $sceProvider.enabled(false);
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

require("./app/controllers/app.controller.js");
require("./app/controllers/bot.controller.js");
require("./app/controllers/auth.controller.js");
require("./app/controllers/dashboard.controller.js");
require("./app/network/network_message.js");
require("./app/network/client_socket.js");
require("./app/protocol/protocol.js");
require("./app/managers/bot_manager.js");
require("./app/managers/network_manager.js");
require("./app/io/bytearray.js");
require("./app/io/custom_data_wrapper.js");
