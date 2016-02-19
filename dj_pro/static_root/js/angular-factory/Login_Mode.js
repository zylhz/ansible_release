app.factory('Login_Mode', ['$resource', function($resource) {
        return $resource('/ipinfo/login_mode_api/:id', {}, {
            query:{
                method: 'GET',
                isArray: true
                },
            save: {
                method: 'POST',
                isArray: false,
                },
                });
}]);
