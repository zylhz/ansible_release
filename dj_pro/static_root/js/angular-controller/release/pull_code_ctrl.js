routeapp.controller('pull_code_ctrl', function($scope, $http, ipCookie, Project_Group, Project_Item, Log_Save) {
    $scope.project_groups = Project_Group.query();
    loginname = ipCookie('loginname');
    $scope.project_id = (window.location.pathname).split('/')[3];
    process_directory = Project_Group.get({id:$scope.project_id},function(){
        $scope.process_directory = process_directory;
        console.log($scope.process_directory);
        });
    $scope.pull_show = '';
    $scope.wait_msg = '';
    $scope.wait_flag = false;
    $scope.items_container = [];
    $scope.simple_log = '';
    $scope.complex_log = '';
    $scope.error_log = '';

    Project_Item.query(function(items){
        for(i in items){
            if(items[i].pro_group == $scope.project_id){
                $scope.items_container.push(items[i]);
            };
        };
        console.log($scope.items_container);
    });

    if($scope.project_id != ''){
        Project_Group.get({id:$scope.project_id},function(item){
        $scope.project_group = item;
        console.log(item);
        });
    };

    $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = false;
        } else {
            $scope.selectedAll = true;
        }
        angular.forEach($scope.items_container, function (item) {
            item.Selected = $scope.selectedAll;
        });

    };

    $scope.checknameAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = false;
        } else {
            $scope.selectedAll = true;
        }
        angular.forEach($scope.yml_set, function (item) {
            item.Selected = $scope.selectedAll;
        });

    };


    $scope.insertversion = function(group, version){
        for(i in $scope.items_container){
            if(group.pro_name == $scope.items_container[i].pro_name){
                $scope.items_container[i].version = version;
            };
        }
        console.log($scope.items_container);
    };

    $scope.nowbranch = {};
    $scope.search_branch = function(pro){
        console.log(pro);
        // return;
        $http({
                method: 'POST',
                url: '/release/project_item_api/branch_list/',
                data: JSON.stringify(pro),
        }).success(function(result){
    	for(i in $scope.items_container){
        	if(pro.pro_name == $scope.items_container[i].pro_name){
            	$scope.items_container[i].version = result[1];
			    var key = $scope.items_container[i].pro_name;
			    $scope.nowbranch[key] = result[1];
			};
		};
		console.log($scope.nowbranch);
            $scope.branches = result[0];
            console.log(result[0]);
        }).error(function(err){
            console.log('error');
        });
    };

    $scope.backup_selected = function(){
	$scope.pull_show = 'disabled';
	$scope.wait_flag = true;
    	$scope.wait_msg = '请稍作等待，不要切换页面，否则无法看到日志';
        selected_pro = [];
        all_para = [];
        $("input[type=checkbox]:checked").each ( function() {
            selected_pro.push( $(this).val() );
        });
        delete selected_pro[selected_pro.indexOf('on')]
        console.log(selected_pro);
        for(i in $scope.items_container){
            console.log($scope.items_container[i]);
            for(x in selected_pro){
                console.log(selected_pro[x]);
                if($scope.items_container[i].pro_name == selected_pro[x]){
                    all_para.push($scope.items_container[i]);
                };
            };
        };
        console.log(all_para);
        $http({
            method: 'POST',
            url: '/release/project_item_api/backup_all/',
            data: JSON.stringify(all_para),
        }).success(function(result){
	        $scope.simple_log = result;
            console.log(result);
	        $scope.pull_show = '';
	        $scope.wait_flag = false;
	        $scope.wait_msg = '';
        }).error(function(err){
            console.log('error');
        });
    };

// above is the initail program

    function common_post(url, ctype, pro){
        console.log(pro);
        $scope.pull_show = 'disabled';
        $scope.wait_msg = '请稍作等待，不要切换页面，否则无法看到日志';
        $scope.wait_flag = true;
        $http({
            method: 'POST',
            url: url,
            data: pro
        }).success(function(result){
            console.log(2);
            re = /mem/i;
            re1 = /redis/i;
            console.log(result);
            if(ctype ==='process'){
                for(i in result){
                    if(result[i]['name'].match(re) != null || result[i]['name'].match(re1) != null){
                        memred = result[i];
                        result.splice(i,1);
                        console.log(result);
                        result.unshift(memred);
                    };
                };
            };
            if(ctype ==='show_all'){
                $scope.costome_hide = [];
                for(i in result){
                    $scope.costome_hide[result[i]['yml_full_distination']] = false;
                }
                console.log($scope.costome_hide);
            };
            $scope.yml_set = result;
            console.log(result);
            $scope.pull_show = '';
            $scope.wait_flag = false;
            $scope.wait_msg = '';
        }).error(function(err){
            console.log('error');
            $scope.pull_show = '';
            $scope.wait_flag = false;
            $scope.wait_msg = '';
        });
    };

    function one_common(pro, url, ctype){
        if (typeof(ctype)==='undefined') ctype = 'pull';
	    $scope.pull_show = 'disabled';
    	$scope.wait_msg = '请稍作等待，不要切换页面，否则无法看到日志';
	    $scope.wait_flag = true;
        $http({
            method: 'POST',
            url: url,
            data: JSON.stringify(pro),
        }).success(function(result){
	    $scope.simple_log += result[0] + '\n';
	    $scope.complex_log += result[1] + '\n';
	    $scope.pull_show = '';
	    $scope.wait_msg = '';
	    $scope.wait_flag = false;
        $scope.cost_time = [];
        $scope.cost_time[pro.pro_name] = result[2];
        console.log(pro.pro_name + $scope.cost_time[pro.pro_name]);
        $scope.error_log += result[3] + '\n';
        $scope.all_cost_time = result[2];
        console.log(result);
        console.log(1+$scope.error_log+1);
        if(ctype ==  'backup'){
            if($scope.error_log != ''){
                alert('备份未成功,' + $scope.error_log);
                return;
            }else{
                alert('备份成功');
                one_common(pro, '/release/project_item_api/branch_release/', 'release');
            };
        };
	    console.log(result);

        $http.post('/release/log_save_api/', {'username': loginname, 
                    'pro_group': $scope.project_id,
                    'log_complex': result[1],
                    'log_type': ctype
        }).success(function(res){
            console.log(res);
        }).error(function(err){
            alert('log add error');
        });

        }).error(function(err){
            alert('error');
            $scope.pull_show = '';
            $scope.wait_flag = false;
            $scope.wait_msg = '';
        });
    };

    function one_common_ver(pro, url, version, ctype){
        pro.version = version;
	    console.log(version);
        one_common(pro, url, ctype)
    };

    function multi_common(url, ctype){
        if (typeof(ctype)==='undefined') ctype = 'pull';
	    $scope.pull_show = 'disabled';
	    $scope.wait_flag = true;
    	$scope.wait_msg = '请稍作等待，不要切换页面，否则无法看到日志';
        selected_pro = [];
        all_para = [];
        $("input[type=checkbox]:checked").each ( function() {
            selected_pro.push( $(this).val() );
        });
        delete selected_pro[selected_pro.indexOf('on')]
        process_directory = Project_Group.get({id:$scope.project_id},function(){
        if(ctype == 'process'){
                $scope.process_directory = process_directory;
                for(i in selected_pro){
                    all_para.push({'name': selected_pro[i], 'ansi': process_directory['pro_ansi_process_directory_reset_yml'] +  selected_pro[i] + '.yml', 'pro_group': $scope.project_id, 'pro_name': selected_pro[i]});
                
                };
                console.log(selected_pro);
        }else{
            console.log(selected_pro);
            for(i in $scope.items_container){
                console.log($scope.items_container[i]);
                for(x in selected_pro){
                    console.log(selected_pro[x]);
                    if($scope.items_container[i].pro_name == selected_pro[x]){
                        all_para.push($scope.items_container[i]);
                    };
                };
            };
        };
        console.log(all_para);
        console.log(url);
        $http({
            method: 'POST',
            url: url,
            data: JSON.stringify(all_para),
        }).success(function(result){
	        $scope.simple_log += result[0] + '\n';
	        $scope.complex_log += result[1] + '\n';
            console.log(result);
	        $scope.pull_show = '';
	        $scope.wait_flag = false;
	        $scope.wait_msg = '';
            $scope.cost_time = {};
            for(i in all_para){
                console.log(all_para);
                console.log(result);
                $scope.cost_time[all_para[i].pro_name] = result[2][all_para[i].pro_name];
            };
            $scope.all_cost_time = result[2]['total'];
            $scope.error_log += result[3] + '\n';
            error_log = $scope.error_log.split('\n').join('');
            if(ctype ==  'backup'){
                if(error_log != ''){
                    alert('备份未成功,' + $scope.error_log);
                    return;
                }else{
                    alert('备份成功');
                    multi_common('/release/project_item_api/release_all/', 'release');
                };
            };
        $http.post('/release/log_save_api/', {'username': loginname, 
                    'pro_group': $scope.project_id,
                    'log_complex': result[1],
                    'log_type': ctype
        }).success(function(res){
            console.log(res);
        }).error(function(err){
            alert('log add error');
        });




        }).error(function(err){
            alert('error');
            $scope.pull_show = '';
            $scope.wait_flag = false;
            $scope.wait_msg = '';
        });
        });
    };

// above is public function
    $scope.costome_hide = false;

    $scope.costomehide = function(i){
        console.log(i);
        $scope.costome_hide[i] = !$scope.costome_hide[i];
        console.log($scope.costome_hide);
    };

    $scope.search_yml = function(){
        Project_Item.query(function(items){
            items_container = [];
            for(i in items){
                if(items[i].pro_group == $scope.project_id){
                    console.log(items[i]);
                    items_container.push(items[i]);
                };
            };
            console.log(items_container[0]);
            common_post('/release/project_item_api/search_yml/', 'show_all', items_container[0]);
        });
    };

    $scope.process_search_yml = function(){
    process_directory = Project_Group.get({id:$scope.project_id},function(){
        $scope.process_directory = process_directory;
        console.log($scope.process_directory);
        pro = {};
        pro['dir'] = process_directory['pro_ansi_process_directory_reset_yml'];
        console.log(pro);
        common_post('/release/project_item_api/process_search_yml/', 'process', pro);
        });
    };
            

    $scope.branch_release = function(pro, version){
        $("#gobackup[type=checkbox]").each ( function() {
            if( $(this).is(':checked') == true){
                console.log(1);
                $scope.simple_log = '';
                $scope.complex_log = '';
                $scope.error_log = '';


                one_common(pro, '/release/project_item_api/backup_release/', 'backup');

            }else{
                one_common(pro, '/release/project_item_api/branch_release/', 'release');
            };
        });
    };

    $scope.release_selected = function(){
        $("#gobackup[type=checkbox]").each ( function() {
            if( $(this).is(':checked') == true){
                $scope.simple_log = '';
                $scope.complex_log = '';
                $scope.error_log = '';
                multi_common('/release/project_item_api/backup_all/', 'backup');
            }else{
                multi_common('/release/project_item_api/release_all/', 'release');
            };
        });
    };

    $scope.pull_branch = function(pro, version){
        one_common_ver(pro,'/release/project_item_api/branch_pull/', version);
    };

    $scope.pull_selected = function(){
        multi_common('/release/project_item_api/pull_all/');
    };

    $scope.process_reset = function(pro){
        pro['pro_group'] = $scope.project_id;
        pro['pro_name'] = pro['name']
        console.log(pro);
        one_common(pro,'/release/project_item_api/process_reset/', 'process');
    };

    $scope.process_selected_reset = function(){
        multi_common('/release/project_item_api/process_selected_reset/', 'process');
    };

    $scope.yml_exe = function(project_group, cos_yml){
        console.log(cos_yml);
        project_group.pro_name = cos_yml;
        project_group.pro_group = project_group.pro_group_name;
        project_group.yml_full_distination = cos_yml;
        console.log(project_group);
        one_common(project_group, '/release/project_item_api/yml_exe/');
    };

    $scope.log_read = function(action){
        logs = [];
        save_logs = Log_Save.query(function(){
            for(i in save_logs){
                if(save_logs[i].pro_group == $scope.project_id){
                    if(save_logs[i].log_type == action){
                        logs.push(save_logs[i]);
                    };
                };
            };
            $scope.complex_logs = logs;
        });
        
    };

});

