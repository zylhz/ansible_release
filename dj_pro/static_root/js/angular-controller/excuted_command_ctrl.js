app.controller('excuted_command_ctrl', function($scope, Excuted_Command) {
    // Get all posts
    $scope.excuted_commands = Excuted_Command.query();
    
    $scope.button_status = '';
    $scope.Excuted_CommandData={};
    $scope.Excuted_CommandPost = function() {
        $scope.Excuted_CommandData.username = 1;
        $scope.Excuted_CommandData.game_script =[];
        $("input[type=checkbox]:checked").each ( function() {
            $scope.Excuted_CommandData.game_script.push( $(this).val() );
        });
        alert("Command:"+ $scope.Excuted_CommandData.game_script);
        $scope.button_status = 'disabled';
        $scope.Excuted_CommandData = Excuted_Command.save($scope.Excuted_CommandData,
            function(result){
                $scope.result = result;
                console.log($scope.result);
                $scope.button_status = '';
            },
            function(err){
                $scope.result = "something wrong here,run it again!"
                console.log("something wrong here!");
                $scope.button_status = '';
            });
            
    };

});
