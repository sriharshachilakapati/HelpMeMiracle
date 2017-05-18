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
    otherwise({
        "redirectTo": "/"
    });
});
