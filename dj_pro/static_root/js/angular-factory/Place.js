app.factory('Place', ['$resource', function($resource) {
        return $resource('/ipinfo/place_api/:id', {}, {
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
