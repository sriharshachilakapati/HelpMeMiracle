let app = angular.module('helpDeskApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider)
{
    $routeProvider.when('/', {
        "templateUrl": "home.html",
        "controller": "mainCtrl"
    });
});
