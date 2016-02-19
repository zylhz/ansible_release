app.controller('CookieCtrl', function ($scope,$window, $location, $rootScope, ipCookie, User , AuthService) {
    loginname = ipCookie('loginname');
    password = ipCookie('password');
    if (!loginname || !password){
        $scope.loginname = 'welcome to login';
    }else
    {
        AuthService.login({'username': loginname,'password': password},
        function(result){
            $scope.loginname = ipCookie('loginname');
            $scope.message = 'check user ok';
        },
        function(err){
            $scope.message = "please login!"
            alert($scope.message);
            ipCookie.remove('loginname', {path: '/'});
            $scope.loginname = 'welcome to login';
            ipCookie.remove('password', {path: '/'});
        });
    };

    if (!loginname){
        $scope.log_value = 'login';
        }
    else{ 
        $scope.log_value = 'logout';
    };
    
    $scope.log_action = function(){
        if ($scope.log_value == 'login'){$window.location.href = "/login";};
        if ($scope.log_value == 'logout'){
            ipCookie.remove('loginname', {path: '/'});
            ipCookie.remove('password', {path: '/'});
            $window.location.href = "/login";
        };
    };

});

