app.controller('ticketCtrl', function($scope, $window, $http, $routeParams)
{
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
                    $scope.ticket = data.ticket;
                    let user = $window.localStorage.getItem('user');
                    $scope.userLoggedIn = user != null;
                    user = JSON.parse(user);

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
                            //
                            // TODO: Fix when Materialize is finally compatible with AngularJS
                            //
                            // console.log($scope.supportTeam);
                            // 
                            // setTimeout(() =>
                            // {
                            //     $('select').material_select('destroy');
                            //     setTimeout(() => $('select').material_select(), 200);
                            // }, 200);
                        })
                        .catch(err =>
                        {
                            console.error(err);
                            Materialize.toast("Failed to fetch support team members");
                        });
                    }
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
