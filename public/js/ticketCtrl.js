app.controller('ticketCtrl', function($scope, $window, $http, $routeParams)
{
    $scope.status = function(status)
    {
        let request = {
            "url": '/tickets/status',
            "method": 'POST',
            "headers": {
                "Content-Type": "application/json"
            },
            "data": {
                "token": JSON.parse($window.localStorage.getItem('user')).token,
                "tid": $routeParams.tid,
                "status": status
            }
        };

        $http(request)
            .success(res =>
            {
                Materialize.toast(res.message, 4000);
            })
            .catch(err =>
            {
                Materialize.toast("Failed to change status", 4000);
                console.error(err);
            });
    };

    $scope.assign = function(mid)
    {
        let request = {
            "url": '/tickets/assign',
            "method": 'POST',
            "headers": {
                "Content-Type": "application/json"
            },
            "data": {
                "token": JSON.parse($window.localStorage.getItem('user')).token,
                "tid": $routeParams.tid,
                "mid": mid
            }
        };

        $http(request)
            .success(res =>
            {
                Materialize.toast(res.message, 4000);
            })
            .catch(err =>
            {
                Materialize.toast("Failed to update Assignee", 4000);
                console.error(err);
            });
    };

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
                    let ticket = $scope.ticket = data.ticket;
                    let user = $window.localStorage.getItem('user');
                    $scope.userLoggedIn = user != null;
                    user = JSON.parse(user);

                    // Check whether the current user can change the status
                    $scope.canChangeStatus = false;
                    if ($scope.userLoggedIn)
                    {
                        $scope.canChangeStatus = user.type === "user" && user.mid === ticket.author;
                        $scope.canChangeStatus = $scope.canChangeStatus || (user.type === "support" && user.mid == ticket.assignee);
                        $scope.canChangeStatus = $scope.canChangeStatus || (user.type === "admin");

                        setTimeout(() => $('select').material_select(), 500);
                    }

                    // Admin can assign support to tickets
                    $scope.supportTeam = null;
                    if ($scope.userLoggedIn && user.type === "admin")
                    {
                        let request = {
                            "url": "/users/support",
                            "method": "GET"
                        };

                        $http(request).success(resp =>
                        {
                            Materialize.toast(resp.message, 4000);
                            $scope.supportTeam = resp.users;

                            setTimeout(() => $('select').material_select(), 500);
                        })
                        .catch(err =>
                        {
                            console.error(err);
                            Materialize.toast("Failed to fetch support team members", 4000);
                        });
                    }
                }
            })
            .catch(err =>
            {
                console.error(err);
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
