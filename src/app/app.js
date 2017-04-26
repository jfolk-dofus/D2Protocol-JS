require("./app/controllers/AuthCtrl.js");
require("./app/controllers/AppCtrl.js");
require("./app/controllers/DashboardCtrl.js");

var Alpha = {
    angular: angular.module('Alpha', [
        'ngCookies',
        'ngResource',
        'Alpha.app.controllers',
        'Alpha.auth.controllers',
        'ui.router'
    ])
};

Alpha.angular.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    console.log("config");
    $stateProvider
        .state('app', {
            url: "/app",
           // abstract: true,
            templateUrl: "views/app/layout.html",
            controller: 'AppCtrl'
        })
        .state('app.dashboard', {
            url: "/dashboard",
            templateUrl: "views/app/dashboard.html",
            controller: "DashboardCtrl"
        })
        .state('auth', {
            url: "/auth",
            abstract: true,
            templateUrl: "views/auth/layout.html",
            controller: 'AuthCtrl'
        })
        .state('auth.login', {
            url: "/login",
            templateUrl: "views/auth/login.html",
        });

    $urlRouterProvider.otherwise('/app/dashboard');
    $locationProvider.html5Mode(true);
});


