app.factory('Log_Save', ['$resource', function($resource) {
        return $resource('/ipinfo/log_save_api/:id', {}, {
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
