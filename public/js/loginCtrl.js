app.controller('loginCtrl', function($scope, $window, $http, $location)
{
    $scope.login = function()
    {
        let request = {
            "method": "POST",
            "url": "/login",
            "headers": {
                "Content-Type": "application/json"
            },
            "data": {
                "mid": $scope.mid,
                "password": $scope.password
            }
        };

        $http(request).then(res =>
        {
            let resp = res.data;

            Materialize.toast(resp.message, 4000);

            if (resp.success)
            {
                $window.localStorage.setItem('user', JSON.stringify(resp.user));
                $location.path('/');
            }
        }).catch(err =>
        {
            console.log(err);
        });
    };
});
