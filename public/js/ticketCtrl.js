app.controller('ticketCtrl', function($scope, $window, $http, $routeParams)
{
    $scope.refreshReplies = function()
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
                {
                    $scope.ticket = data.ticket;
                    $scope.userLoggedIn = $window.localStorage.getItem('user') != null;
                }
            })
            .catch(err =>
            {
                Materialize.toast("Network down, try again in few minutes", 4000);
            });
    };
    $scope.refreshReplies();

    $scope.sendReply = function()
    {
        let request = {
            "url": "/replies/new",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "data": {
                "tid": $routeParams.tid,
                "message": $scope.replyMsg,
                "token": JSON.parse($window.localStorage.getItem("user")).token
            }
        };

        $http(request)
            .success(data =>
            {
                Materialize.toast(data.message, 4000);
                
                $scope.refreshReplies();
                $scope.replyMsg = "";
            })
            .catch(err =>
            {
                Materialize.toast("Network down, try again in few minutes", 4000);
            });
    };
});
