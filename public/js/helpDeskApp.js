let app = angular.module('helpDeskApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider)
{
    $routeProvider.when('/', {
        "templateUrl": "home.html",
        "controller": "mainCtrl"
    }).
    when('/login', {
        "templateUrl": "login.html",
        "controller": "loginCtrl"
    }).
    when('/register', {
        "templateUrl": "register.html",
        "controller": "registerCtrl"
    }).
    when('/logout', {
        "templateUrl": "home.html",
        "controller": "logoutCtrl"
    }).
    when('/ticket/:tid', {
        "templateUrl": "ticket.html",
        "controller": "ticketCtrl"
    }).
    otherwise({
        "redirectTo": "/"
    });
});
