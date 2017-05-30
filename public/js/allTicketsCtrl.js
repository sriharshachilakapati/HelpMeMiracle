app.controller('allTicketsCtrl', function($scope, $http)
{
    let request = {
        "url": "/tickets/all",
        "method": "GET"
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
