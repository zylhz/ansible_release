routeapp.controller('search_branch_ctrl', function($scope, $state, Project_Item ,$http) {
    $scope.project_id = (window.location.pathname).split('/')[3];
    $scope.oneAtATime = true;   // not allow to open all project at one time

    $scope.items_list = [];
    Project_Item.query(function(pro_items){
        for(i in pro_items){
            if(pro_items[i].pro_group == $scope.project_id){
                $scope.items_list.push(pro_items[i]);
            };
        };
        $scope.status = {
            isItemOpen: new Array($scope.items_list.length),
    	    open: false,
	        isFirstDisabled: false
        };
    });
    
    $scope.show_branch = false;

    function common_post(url, ctype, pro){
        $scope.pull_show = 'disabled';
        $scope.wait_msg = '请稍作等待，不要切换页面，否则无法看到日志';
        $scope.wait_flag = true;
        $http({
            method: 'POST',
            url: url,
            data: pro
        }).success(function(result){
            $scope.pull_show = '';
            $scope.wait_flag = false;
            $scope.wait_msg = '';
            $state.go('search_branch');
        }).error(function(err){
            console.log('error');
            $scope.pull_show = '';
            $scope.wait_flag = false;
            $scope.wait_msg = '';
        });
    };

    $scope.toggle_branch = function(pro_name ,showhide){
        $scope.branches[pro_name+'show'] = !showhide;
    };

    $scope.git_pull = function(i){
        item = {};
        item['dir'] = i;
        common_post('/release/project_item_api/git_pull/', undefined, item);
    };


    $scope.nowbranch = {};
    $scope.branches = {};
    $scope.db_name = {};
    $scope.db_host = {};
    $scope.db_msg = {};
    $scope.search_branch = function(pro){
        // return;
        $http({
                method: 'POST',
                url: '/release/project_item_api/branch_list/',
                data: JSON.stringify(pro),
            }).success(function(result){
		for(i in $scope.items_list){
		    if(pro.pro_name == $scope.items_list[i].pro_name){
			var key = $scope.items_list[i].pro_name;
			var showkey = $scope.items_list[i].pro_name + 'show';
			$scope.nowbranch[key] = result[1];
			$scope.branches[key] = result[0];
            if(result[2] == 'not'){
                $scope.db_msg[key] = '警告：json丢失，请在' + $scope.items_list[i].pro_ansi_release_yml.split('.')[0] + '_db/目录下创建database.json'
            }else{
                $scope.db_msg[key] = '';
			    $scope.db_name[key] = result[2];
			    $scope.db_host[key] = result[3];
            };
			$scope.branches[showkey] = false;
		    };
		};
            }).error(function(err){
                console.log('error');
            });
    };

    $scope.change_branch = function(branch){
        $http({
                method: 'POST',
                url: '/release/project_item_api/branch_change/',
                data: {'branch': branch},
            }).success(function(result){
                console.log(result);
            }).error(function(err){
                console.log('error');
            }); 
    };


});
