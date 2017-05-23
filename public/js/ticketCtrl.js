app.controller('ticketCtrl', function($scope, $http, $routeParams)
{
    let request = {
        "url": `/tickets/${ $routeParams.tid }`,
        "method": "GET"
    };

    $http(request)
        .success(data =>
        {
            if (!data.success)
                Materialize.toast(data.message, 4000);
            else
                $scope.ticket = data.ticket;
        })
        .catch(err =>
        {
            Materialize.toast("Network down, try again in few minutes", 4000);
        });
});
