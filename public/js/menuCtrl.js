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

            if (user.type !== "user")
                $scope.nav.push({ "name": "All Tickets", "href": "/all" });

            if (user.type === "admin")
                $scope.nav.push({ "name": "New User", "href": "/register" });

            if (user.type === "user")
                [
                    { "name": "New Ticket", "href": "/new" },
                    { "name": "My Tickets", "href": "/my" }
                ].
                forEach(menu => ($scope.nav.push(menu)));

            $scope.nav.push({ "name": "Logout", "href": "/logout" });
        }
    };

    $scope.$on('$routeChangeSuccess', $scope.updateMenus);
    $scope.updateMenus();
});
