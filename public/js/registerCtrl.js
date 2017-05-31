app.controller('registerCtrl', function($scope, $window, $http, $location)
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
                "type": $scope.reg.type,
                "name": $scope.name,
                "mail": $scope.mail,
                "password": $scope.password,
                "token": JSON.parse($window.localStorage.getItem('user')).token
            }
        };

        $http(request).
            success(res =>
            {
                Materialize.toast(res.message, 4000);
                $location.path("/");
            }).
            catch(err =>
            {
                Materialize.toast("Network failure!", 4000);
                console.error(err);
            })
    };
});
