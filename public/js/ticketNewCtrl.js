app.controller('ticketNewCtrl', function($scope, $window, $http, $location)
{
    $scope.createTicket = function()
    {
        let request = {
            "url": "/tickets/new",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "data": {
                "title": $scope.ticket.title,
                "description": $scope.ticket.message,
                "category": $scope.ticket.category,
                "location": $scope.ticket.location,
                "department": $scope.ticket.department,
                "project": $scope.ticket.project,
                "shiftTime": $scope.ticket.shiftTime,
                "extensionOrMobile": $scope.ticket.extensionOrMobile,
                "ipAddress": $scope.ticket.ipAddress,
                "token": JSON.parse($window.localStorage.getItem('user')).token
            }
        };

        $http(request).success(data =>
        {
            Materialize.toast(data.message, 4000);

            if (data.success)
                $location.path('/');
        }).
        catch(err =>
        {
            console.error(err);
            Materialize.toast("Network connectivity issue! Try again later!", 4000);
        });
    };
});
