let app = angular.module('helpDeskApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider)
{
    $routeProvider.when('/', {
        "templateUrl": "tickets.html",
        "controller": "allTicketsCtrl"
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
        "templateUrl": "tickets.html",
        "controller": "logoutCtrl"
    }).
    when('/ticket/:tid', {
        "templateUrl": "ticket.html",
        "controller": "ticketCtrl"
    }).
    when('/my', {
        "templateUrl": "tickets.html",
        "controller": "myTicketsCtrl"
    }).
    when('/new', {
        "templateUrl": "ticketNew.html",
        "controller": "ticketNewCtrl"
    }).
    otherwise({
        "redirectTo": "/"
    });
});
