app.factory('Excuted_Command', ['$resource', function($resource) {
        return $resource('/setgame/excuted_command_api/:id', {}, {
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
