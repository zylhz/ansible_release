routeapp.controller('database_code_ctrl',function($scope, $http, Upload) {

        $scope.log = '';
        $scope.files = [];
        $scope.filename = [];
        $scope.filelist = [];
        $scope.tmp = {};
        $scope.backup_count = {};

    function goupload(url) {
        if($scope.sql_file == undefined){
            return;
            };
            Upload.upload({
                url: url,
                method: 'POST',
                file: $scope.sql_file[0],
                fileFormDataName: 'file',
                fields: {'username' :1, 'datadir': $scope.dir},
                headers: {
                    'content-type': 'multipart/form-data',
                },
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log(progressPercentage);
                $scope.log = 'progress: ' + progressPercentage + '% ' +
                            evt.config.file.name;
            }).success(function (data, status, headers, config) {
                $scope.log = 'file ' + config.file.name + ' ' + ' uploaded success' + '    ' + $scope.log;
                alert(config.file.name + '上传成功');
                dir_list = $scope.dir.split('.')[0];
                up_set.dir = dir_list;
                up_set.all_dir = $scope.dir;
                common_post(up_set, '/release/process_reset_api/list_dir/', 'upinfo');
            }).error(function (data, status, headers, config) {
                 $scope.log = 'file ' + config.file.name + ' ' + ' uploaded failed' + '    ' + $scope.log;
                alert(config.file.name + '上传失败');
            });
        };

    //angular.forEach($scope.sql_file, function (key) {
        $scope.$watch('sql_file', function () {
            goupload('/release/backup_api/sql_upload/');
        });
    //}); 


    function common_post(pro, url, type){
        $http({
            method: 'POST',
            url: url,
            data: pro
        }).success(function(result){
            if(type == 'upinfo'){
                $scope.up_info = result;
                for( i in $scope.up_info[pro.all_dir]){
                    $scope.up_info[pro.all_dir][i].short_name = $scope.up_info[pro.all_dir][i].name.split('/').pop();
                    tmp = $scope.up_info[pro.all_dir][i].name.replace(/\//g,'_');
                    $scope.up_info[pro.all_dir][i].cut_name = tmp.replace(/\./g,'_');
                };

            };
            if(type == 'find_drop'){
                $scope.find_droptext = result;
                console.log($scope.now_name);
                now_dir = $scope.now_name.split('/');
                now_dir.pop();
                base_dir = now_dir.join('/');
                console.log($scope.backup_count[base_dir]);
                if($scope.find_droptext.text == ''){
                    if($scope.backup_count[base_dir] != 0){
                        $scope.execute_sql($scope.now_name);
                    };
                }else{
                    $scope.show_execute = "";
                };
            };
            if(type == 'file_text'){
                $scope.file_text = result;
            };
            if(type == 'delete'){
                $scope.up_info = result;
                for( i in $scope.up_info[pro.all_dir]){
                    $scope.up_info[pro.all_dir][i].short_name = $scope.up_info[pro.all_dir][i].name.split('/').pop();
                    tmp = $scope.up_info[pro.all_dir][i].name.replace(/\//g,'_');
                    $scope.up_info[pro.all_dir][i].cut_name = tmp.replace(/\./g,'_');
                };
                $('#Modeldelete').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            };
            if(type == 'create'){
                $scope.up_info = result;
                for( i in $scope.up_info['dir']){
                    $scope.up_info['dir'][i].short_name = $scope.up_info['dir'][i].name.split('/').pop();
                };
                $('#Modelcreate_dir').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            };
            if(type == 'db_excute'){
                $scope.find_droptext = result;
                $scope.show_execute = 'disabled';
                now_dir = result['dir'].split('/');
                now_dir.pop();
                base_dir = now_dir.join('/');
                $scope.backup_count[base_dir] += 1;
                console.log(base_dir);
                $scope.show_backup = 'disabled';
                console.log(base_dir);
            };
            if(type == 'db_backup'){
                now_dir = $scope.now_name.split('/');
                now_dir.pop();
                base_dir = now_dir.join('/');
                $scope.backup_count[base_dir] += 1;
                console.log(base_dir);
                $scope.find_droptext = result;
                $scope.find_difftext = '备份文件为' + result['after_out_file'] + '大小为' + result['after_out_size'] + '\n' + '前一次备份为' + result['before_out_file'] + '大小为' + result['before_out_size'] + '\n' +',变动大小为' + result['diff_size'] + 'k\n';
                $scope.show_backup = 'disabled';
                };
        }).error(function(err){
            console.log('error');
        });
    };

    up_set = {};

    $scope.search_dir = function(dir){
        $http.post('/release/process_reset_api/list_dir/',{'dir': dir}
            ).success(function(result){
                $scope.tmp = {};
                if(result == []){
                    return;
                };
                for( i in result){
                    $scope.tmp['name'] = result[i][0];
                    $scope.tmp['time'] = result[i][1];
                };
                $scope.filelist.push($scope.tmp);
                console.log($scope.filelist);
            }).error(function(err){
                console.log(error);
            });
        };

    $scope.list_dir = function(dir){
        now_dir = dir.split('/');
        now_dir.pop();
        base_dir = now_dir.join('/');
        dir_list = dir.split('.')[0];
        up_set.dir = dir_list;
        up_set.all_dir = dir;
        $scope.backup_count[dir_list+'_db'] = 0;
        console.log($scope.backup_count);
        common_post(up_set, '/release/process_reset_api/list_dir/', 'upinfo');
    };


    $scope.read_before = function(num){
        up_set.dir = $scope.now_name;
        if(num == undefined){
            up_set.num = 10;
        }else{
            up_set.num = num;
        };
        console.log(up_set);
        common_post(up_set, '/release/process_reset_api/read_before/', 'file_text');
    };

    $scope.read_after = function(num){
        up_set.dir = $scope.now_name;
        up_set.num = num;
        console.log(up_set);
        common_post(up_set, '/release/process_reset_api/read_after/', 'file_text');
    };



    $scope.now_set_name = function(now_name,short_name){
        $scope.now_name = now_name;
        $scope.short_name = short_name;
    };


    
    $scope.find_drop = function(now_name,short_name,cut_name){
        $scope.find_difftext = '';
        $scope.show_backup = '';
        $scope.cut_name = cut_name;
        $scope.now_name = now_name;
        $scope.short_name = short_name;
        now_dir = now_name.split('/');
        now_dir.pop();
        base_dir = now_dir.join('/');
        console.log(base_dir);
        up_set.now_name = now_name;
        console.log($scope.backup_count);
        if($scope.backup_count[base_dir] == 0){
                $scope.backup_db(now_name);
        };
        common_post(up_set, '/release/process_reset_api/db_find_drop/', 'find_drop')
    };

    $scope.delete_file = function(all_dir, delete_file){
        console.log(delete_file + ' ' + all_dir);
        now_dir = delete_file.split('/');
        now_dir.pop();
        base_dir = now_dir.join('/');
        console.log(base_dir);
        up_set.dir = base_dir;
        up_set.delete_file = delete_file;
        up_set.all_dir = all_dir;
        console.log(up_set);
        common_post(up_set, '/release/process_reset_api/delete_file/', 'delete');
    };

    $scope.execute_sql = function(now_name){
        //if($scope.backup_count[dir] == 0){
        //    $scope.show_backup = true;
        //};
        $scope.now_name = now_name;
        up_set.dir = $scope.now_name;
        now_dir = now_name.split('/');
        now_dir.pop();
        base_dir = now_dir.join('/');
        up_set.now_dir = base_dir;
        console.log(up_set);
        common_post(up_set, '/release/process_reset_api/execute_sql/', 'db_excute');
    };

    $scope.backup_db = function(now_name){
      //  if($scope.backup_count[dir] == 0){
      //      $scope.show_backup = true;
      //  };
        $scope.now_name = now_name;
        up_set.dir = $scope.now_name;
        now_dir = now_name.split('/');
        now_dir.pop();
        base_dir = now_dir.join('/');
        up_set.now_dir = base_dir;
        console.log(up_set);
        common_post(up_set, '/release/process_reset_api/backup_db/', 'db_backup');
    };

});
