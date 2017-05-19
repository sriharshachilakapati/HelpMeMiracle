app.controller('logoutCtrl', function($scope, $window, $location)
{
    $window.localStorage.removeItem('user');
    $location.path('/');
    Materialize.toast("You're now logged out", 4000);
});
