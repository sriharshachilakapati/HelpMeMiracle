app.controller('homeCtrl', function ($scope, $window, $location)
{
    let user = $window.localStorage.getItem('user');

    if (user != null)
    {
        user = JSON.parse(user);
        if (user.type === "admin")
            $location.path('/all');
        else
            $location.path('/my');
    }
});
