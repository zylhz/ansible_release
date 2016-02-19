app.factory('Database_Addr', ['$resource', function($resource) {
        return $resource('/ipinfo/database_addr_api/:id', {}, {
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

app.factory('Database_Conn', ['$resource', function($resource) {
        return $resource('/ipinfo/database_conn_api/:id', {}, {
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

app.factory('Database_Info', ['$resource', function($resource) {
        return $resource('/ipinfo/database_info_api/:id', {}, {
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
