routeapp.controller('init_env_control', function($scope, $http){

    selected_items = [];
    $scope.progress = 0;

    function common(bro, url, ctype, i, num){
        i = typeof i !== 'undefined' ? i : 0;
        if(ctype == 'multi'){
            if(i >= num){
                return;
            };
            pro = bro[i];
            console.log(pro);
            i += 1;
            console.log(i);
            /*for(j = $scope.progress; j < progress_num - 1; j++){
                $scope.progress += 1;
            };*/
        }else{
            pro = bro;
        };
        console.log(bro);
        $scope.pull_show = 'disabled';
        $scope.wait_msg = '请稍作等待，不要切换页面，否则无法看到日志';
        $scope.wait_flag = true;
        $http({
            method: 'POST',
            url: url,
            data: JSON.stringify(pro),
        }).success(function(result){
            $scope.simple_log += result[0];
            $scope.complex_log += result[1]
            $scope.pull_show = '';
            $scope.wait_msg = '';
            $scope.wait_flag = false;
            $scope.cost_time = [];
            $scope.cost_time[pro.pro_name] = result[2];
            console.log(pro.pro_name + $scope.cost_time[pro.pro_name]);
            $scope.error_log += result[3];
            $scope.all_cost_time = result[2];
            console.log(result);
            console.log(1+$scope.error_log+1);
            //$scope.progress = progress_num;
            $scope.project_log += pro.process_vars + '  ';
            
            if(ctype == 'multi'){
                console.log(bro[i]);
                common(bro, url, ctype, i, num);
                //if( progress_num >= 100 ){ $scope.progress = 100 };
            };
        }).error(function(err){
            alert('error');
            $scope.pull_show = '';
            $scope.wait_flag = false;
            $scope.wait_msg = '';
        });
    };
    
    function common_post(pro, url){
        $http({
            method: 'POST',
            url: url,
            data: pro
        }).success(function(result){
            $scope.yml_set = result;
            console.log(result);
        }).error(function(err){
            console.log('error');
        });
    };

    $scope.checkAll = function () {                               
        if ($scope.selectedAll) {                                 
            $scope.selectedAll = false;                           
        } else {                                                  
            $scope.selectedAll = true;                            
        }                                                         
        angular.forEach($scope.yml_set, function (item) { 
            item.Selected = $scope.selectedAll;                   
        });                                                       
                                                              
    };

    $scope.find_items = function(pro){
        $scope.pro = {};
        $scope.pro.init_book = '/data/ansible/lnmp/roles/tasks.txt';
        $scope.pro.separate_book = '/data/ansible/lnmp/roles/separate.yml';
        $scope.pro.pro_group = 'lnmp';
        common_post($scope.pro,'/release/project_item_api/init_env_items/');
    };

    $scope.excute_single = function(vars){
        $scope.pro.myhost = $scope.init_ip;
        console.log($scope.pro.myhost);
        $scope.pro.myhost = '192.168.1.54';
        console.log(vars);
        $scope.pro.process_vars = vars.item;
        $scope.pro.pro_name = vars.item;
        common($scope.pro, '/release/project_item_api/single_env_install/');
    };

    $scope.excute_selected = function(){
        $scope.progress = 0;
        $scope.project_log = '已完成';
        $scope.myhost_list = $scope.init_ip.split("\n");
        var rx=/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
        for(i in $scope.myhost_list){
            if(!rx.test($scope.myhost_list[i])){
                $scope.project_log = $scope.myhost_list[i] + "格式不正确";
                return;
            };
        };
        //$scope.pro.myhost = '192.168.1.54';
        if(typeof $scope.myhost_list == 'undefined'){
            return;
        };
        num = 0;
        $(".selected input:checked").each ( function() {
            bro = $scope.pro;
            console.log($(this).val());
            tmp_dict = {'process_vars': $(this).val(), 'pro_name': $(this).val()};
            dist = $.extend(tmp_dict, $scope.pro);
            console.log(dist);
            selected_items.push(dist);
            num += 1;
        });
        console.log(selected_items);
        selected_addhost = [];
            //$scope.pro.myhost = myhost_list[i];
        angular.forEach($scope.myhost_list, function (x) { 
            angular.forEach(selected_items, function (i,j) { 
                console.log(x);
                dist = '';
                dist = $.extend({'myhost': x}, selected_items[j]);
                console.log(dist);
                selected_addhost.push(dist);
            });
            common(selected_addhost, '/release/project_item_api/single_env_install/', 'multi', undefined, num);

            console.log(selected_addhost);
            selected_addhost = [];
        });
            //common(selected_addhost, '/release/project_item_api/single_env_install/', 'multi', undefined, num);
    };


});

