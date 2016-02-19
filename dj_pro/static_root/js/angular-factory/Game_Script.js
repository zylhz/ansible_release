app.factory('Game_Script', ['$resource', function($resource) {
        return $resource('/setgame/game_script_api/:script_id', {}, {
            query:{
                method: 'GET',
                isArray: true
                }
                });
            
}]);
