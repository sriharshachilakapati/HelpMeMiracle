app.controller('myTicketsCtrl', function($scope, $window, $http)
{
    let request = {
        "url": "/tickets/my",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": {
            "token": JSON.parse($window.localStorage.getItem('user')).token
        }
    };

    $http(request)
        .success(data =>
        {
            if (!data.success)
                Materialize.toast(data.message, 4000);
            else
                $scope.tickets = data.tickets;
        })
        .catch(err =>
        {
            Materialize.toast("Network down, try again in few minutes", 4000);
        });
});
