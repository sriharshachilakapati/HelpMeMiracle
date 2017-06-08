app.controller('menuCtrl', function($scope, $window)
{
    $scope.updateMenus = function()
    {
        let user = $window.localStorage.getItem('user');

        if (user == null)
            $scope.nav = [
                { "name": "Login", "href": "/login" }
            ];
        else
        {
            user = JSON.parse(user);

            $scope.nav = new Array();

            if (user.type !== "admin")
                $scope.nav.push({ "name": "My Tickets", "href": "/my" });

            if (user.type === "admin")
                [
                    { "name": "All Tickets", "href": "/all" },
                    { "name": "New User", "href": "/register" }
                ].
                forEach(menu => ($scope.nav.push(menu)));

            if (user.type === "user")
                $scope.nav.push({ "name": "New Ticket", "href": "/new" });

            $scope.nav.push({ "name": "Logout", "href": "/logout" });
        }
    };

    $scope.$on('$routeChangeSuccess', $scope.updateMenus);
    $scope.updateMenus();
});
