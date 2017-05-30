app.controller('menuCtrl', function($scope, $window)
{
    $scope.updateMenus = function()
    {
        let user = $window.localStorage.getItem('user');

        if (user == null)
            $scope.nav = [
                { "name": "Login", "href": "/login" },
                { "name": "Register", "href": "/register" }
            ];
        else
            $scope.nav = [
                { "name": "All Tickets", "href": "/" },
                { "name": "New Ticket", "href": "/new" },
                { "name": "My Tickets", "href": "/my" },
                { "name": "Logout", "href": "/logout" }
            ];
    };

    $scope.$on('$routeChangeSuccess', $scope.updateMenus);
    $scope.updateMenus();
});
