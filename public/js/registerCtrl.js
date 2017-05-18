app.controller('registerCtrl', function($scope, $http, $location)
{
    $scope.register = function()
    {
        let request = {
            "method": "POST",
            "url": "/register",
            "headers": {
                "Content-Type": "application/json"
            },
            "data": {
                "mid": $scope.mid,
                "name": $scope.name,
                "mail": $scope.mail,
                "password": $scope.password
            }
        };

        $http(request).then(() => $location.path("/"))
            .catch(() => ($scope.error = "Failed to register account!"));
    };
});
