app.factory('Project_Info', ['$resource', function($resource) {
        return $resource('/ipinfo/project_info_api/:id', {}, {
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
