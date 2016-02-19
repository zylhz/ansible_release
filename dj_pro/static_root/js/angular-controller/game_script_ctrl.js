app.controller('game_script_ctrl', function($scope, Game_Script) {
    // Get all posts
    $scope.game_scripts = Game_Script.query();

    Game_Script.query(function(game_scripts){             //put on where values of query is going to deal with ; 
        $scope.gamename = game_scripts;
        $scope.gamename_len = [];
        //remove the duplications
        for (i in $scope.gamename){                                  //get gamename array  
            $scope.gamename_len.push($scope.gamename[i].gamename);};
        $scope.gamename_uniq = [];
        $.each($scope.gamename_len, function(i, el){                  //get non-duplicated array
            if($.inArray(el, $scope.gamename_uniq) === -1) $scope.gamename_uniq.push(el);
        }); 
        console.log($scope.gamename_uniq);
        
        $scope.gamename_sum_ip = [];
        $scope.gamename_use_has_ip = [];
        for (i in $scope.gamename){                                  //get gamename_sum_ip array
                $scope.gamename_sum_ip.push($scope.gamename[i].access_ip);
                $scope.gamename_use_has_ip.push($scope.gamename[i].gamename+$scope.gamename[i].access_ip);
                };
                $scope.gamename_uniq_ip = [];
                $.each($scope.gamename_sum_ip, function(i, el){                  //get non-duplicated array
                    if($.inArray(el, $scope.gamename_uniq_ip) === -1) $scope.gamename_uniq_ip.push(el);
                }); 

        $scope.has_ip = function(script,ip){
            combine = script+ip;
            for(i in $scope.gamename_use_has_ip){
                if(combine == $scope.gamename_use_has_ip[i])
                    {return true};

                };
            };
      
        }); 

    $scope.isCollapsed1 = true;
    $scope.isCollapsed2 = true;
});    
