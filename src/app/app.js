angular.module('Alpha', [
    'ui.router',
    'Alpha.app.controllers',
    'Alpha.auth.controllers'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
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

    $urlRouterProvider.otherwise('/auth/login');
    //$locationProvider.html5Mode(true);
});

