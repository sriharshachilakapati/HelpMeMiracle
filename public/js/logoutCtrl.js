app.controller('logoutCtrl', function($scope, $window, $location)
{
    $window.localStorage.removeItem('user');
    $location.path('/');
});
