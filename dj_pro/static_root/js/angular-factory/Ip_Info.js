app.factory('Ip_Info', ['$resource', function($resource) {
        return $resource('/ipinfo/ip_info_api/:id', {}, {
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
