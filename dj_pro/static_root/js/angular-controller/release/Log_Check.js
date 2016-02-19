routeapp.controller('Log_Check_Ctrl', function ($scope, $window, $http, ipCookie, User) {
    loginname = ipCookie('loginname');
    password = ipCookie('password');
    if (!loginname || !password){
        $scope.loginname = 'welcome to login';
    }else{
        $http.post('/users/login/',
        {'username': loginname,'password': password}
        ).success(function(res){
            $scope.loginname = ipCookie('loginname');
            $scope.message = 'check user ok';
        }).error(function(err){
            $scope.message = "please login!"
            alert($scope.message);
            ipCookie.remove('loginname', {path: '/'});
            $scope.loginname = 'welcome to login';
            ipCookie.remove('password', {path: '/'});
        });

    };

    if (!loginname){
        $scope.log_value = 'login';
    }else{ 
        $scope.log_value = 'logout';
    };
    
    $scope.log_redirect = function(){
        if ($scope.log_value == 'login'){window.open('/login','_blank')};
        if ($scope.log_value == 'logout'){
            ipCookie.remove('loginname', {path: '/'});
            ipCookie.remove('password', {path: '/'});
            window.open('/login','_blank');
        };
    };


});

