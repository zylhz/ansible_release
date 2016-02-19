routeapp.controller('upyun_control', function($scope, $http, Upload){

    function common(bro, url, ctype, i, num){
        $scope.pull_show = 'disabled';
        $scope.wait_msg = '请稍作等待，不要切换页面，否则无法看到日志';
        $scope.wait_flag = true;
        i = typeof i !== 'undefined' ? i : 0;
        console.log(bro);
        console.log(i)
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
            console.log(1+$scope.error_log+1);
            $scope.progress = progress_num;
        }).error(function(err){
            alert('error');
            $scope.pull_show = '';
            $scope.wait_flag = false;
            $scope.wait_msg = '';
        });
    };
    


    function common_post(pro, url, type){
        $http({
            method: 'POST',
            url: url,
            data: pro
        }).success(function(result){
            if(type == 'upinfo'){
                $scope.up_info = result;
            };
            if(type == 'updelete'){
                $scope.up_delete = result;
                console.log(result);
                alert($scope.up_delete.result);
                $scope.up_set.username = $scope.up_un;
                $scope.up_set.password = $scope.up_pw;
                $scope.up_set.space = $scope.up_sp;
                $scope.up_set.dir = $scope.now_dir;
                console.log($scope.up_set);
                common_post($scope.up_set, '/release/project_var_api/upyun_get_info/', 'upinfo');
            };
            console.log(result);
        }).error(function(err){
            console.log('error');
        });
    };
    
    $scope.up_set = {};
    $scope.now_dir = '/';

    $scope.data_get = function(dir){
        console.log(dir);
        if(dir == '..'){
            temp_dir = $scope.now_dir.split('/')
            temp_dir.pop()
            $scope.now_dir = temp_dir.join('/');
            console.log($scope.now_dir);
            dir = '';
            if($scope.now_dir == ''){
                $scope.now_dir = '/';
            };
        };
        $scope.now_dir = $scope.now_dir + dir; 
        $scope.up_set.username = $scope.up_un;
        $scope.up_set.password = $scope.up_pw;
        $scope.up_set.space = $scope.up_sp;
        $scope.up_set.dir = $scope.now_dir;
        console.log($scope.up_set);
        common_post($scope.up_set, '/release/project_var_api/upyun_get_info/', 'upinfo');
    };

    $scope.file_delete = function(file){
        $scope.up_set.username = $scope.up_un;
        $scope.up_set.password = $scope.up_pw;
        $scope.up_set.space = $scope.up_sp;
        $scope.up_set.file_name = $scope.now_dir + '/' + file;
        console.log($scope.up_set);
        common_post($scope.up_set, '/release/project_var_api/upyun_delete/', 'updelete');
    };

    $scope.mkdir_create = function(dir){
        $scope.up_set.username = $scope.up_un;
        $scope.up_set.password = $scope.up_pw;
        $scope.up_set.space = $scope.up_sp;
        $scope.up_set.new_dir = $scope.now_dir + '/' + dir;
        console.log($scope.up_set);
        common_post($scope.up_set, '/release/project_var_api/upyun_mkdir/', 'updelete');
    };
    

    function goupload(url) {
        $scope.up_set.username = $scope.up_un;
        $scope.up_set.password = $scope.up_pw;
        $scope.up_set.space = $scope.up_sp;
        $scope.up_set.dir = $scope.now_dir;
    console.log($scope.now_dir);
    if($scope.comm_file == undefined){
        console.log('miss');
        return;
        };
        Upload.upload({
            url: url,
            method: 'POST',
            file: $scope.comm_file[0],
            fileFormDataName: 'file',
            fields: {'ho_username' :1, 'dir': $scope.dir, 'username': $scope.up_un, 'password': $scope.up_pw, 'space': $scope.up_sp},
            headers: {
                'content-type': 'multipart/form-data',
            },
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = progressPercentage;
            console.log(progressPercentage);
            $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name;
        }).success(function (data, status, headers, config) {
            $scope.log = 'file ' + config.file.name + ' ' + ' uploaded success' + '    ' + $scope.log;
            alert(config.file.name + '上传成功');
            common_post($scope.up_set, '/release/project_var_api/upyun_get_info/', 'upinfo');
            
        }).error(function (data, status, headers, config) {
            $scope.log = 'file ' + config.file.name + ' ' + ' uploaded failed' + '    ' + $scope.log;
            alert(config.file.name + '上传失败');
        });
    };

    $scope.$watch('comm_file', function (){
        console.log('start upload');
        goupload('/release/project_var_api/upyun_upload/');
    });


});

