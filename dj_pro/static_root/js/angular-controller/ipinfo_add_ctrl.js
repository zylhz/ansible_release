app.controller('ipinfo_add_ctrl',
function($scope, Place, Ip_Info, Project_Info, Login_Mode, Database_Info, User, ipCookie, $http, $window) {
    $scope.places = Place.query();
    $scope.ip_infos = Ip_Info.query();
    $scope.IpData = {};
    $scope.IpData.outerip = '';
    $scope.IpData.innerip = '';
    $scope.IpData.place = '';
    $scope.IpData.master_machine = '';


    $scope.ip_detail_id = (window.location.pathname).split('/')[3];
    console.log($scope.ip_detail_id); 
    if($scope.ip_detail_id === ""){            
            console.log($scope.ip_detail_id);
    }
    else{
        console.log($scope.ip_detail_id);
        $scope.ip_detail = Ip_Info.get({id: $scope.ip_detail_id},function(){
            $scope.IpData_place_id = $scope.ip_detail.place;
            $scope.IpData.place = $scope.ip_detail.place;
            place_detail = Place.get({id: $scope.IpData.place},function(){ 
                $scope.place_detail = place_detail.firm+','+place_detail.district;                 
                console.log($scope.place_detail);                  
            });                                                                  
        });
        $scope.IpData = $scope.ip_detail;
    };
    
    
    Ip_Info.query(function(ips){
    // -------- 修改ip信息
    $scope.ipinfo_post = function() {
        checklog = ipCookie('loginname');
        console.log(checklog);
        if(checklog === undefined){
            alert('非法操作，请先登录！');
            return;
        };
        var rx=/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
        msg = '';
        for( i in $scope.IpData){
            if(typeof $scope.IpData[i] === "undefined"){
                $scope.IpData[i] = '';
            };
        };
        var post = new Ip_Info($scope.IpData);

        // 外网检测格式
        if($scope.IpData.outerip == ''){
            msg = '外网不能为空';
            $scope.outer_msg = msg;
        };
        if(!rx.test($scope.IpData.outerip)){
            msg = 'ip格式不正确';
            $scope.outer_msg = msg;
        };
        if($scope.ip_detail_id == ""){
            for( i in ips){
                if($scope.IpData.outerip == ips[i].outerip){
                    console.log(ips[i].outerip);
                    msg = "外网已被使用";
                    $scope.outer_msg = msg;
                    };
                };
        };
        //网外检测格式结束

        //内网ip检测
        if($scope.IpData.innerip == ''){
            msg = '内网不能为空';
            $scope.inner_msg = msg;
        };
        if(!rx.test($scope.IpData.innerip)){
            msg = 'ip格式不正确';
            $scope.inner_msg = msg;
        };

        //宿主机ip检测

        if($scope.IpData.master_machine != '' && $scope.IpData.master_machine != 'N/A'){
            if(!rx.test($scope.IpData.master_machine)){
                msg = 'ip格式不正确';
                $scope.master_msg = msg;
            };
        };
        
        

        if($scope.IpData.place == ''){
            msg = '所在机房不能为空';
            $scope.place_msg = msg;
        }else{
            if($scope.ip_detail_id == ""){
                place_id = $scope.IpData.place.id; 
                console.log(place_id);
                delete $scope.IpData.place;
                $scope.IpData.place = place_id;
                console.log($scope.IpData.place);
                };
        };
        if(msg !=  ''){
            return true;
        };
        console.log($scope.IpData.place);
        

        // $scope.IpData.place = 1;
        /*
        if($scope.IpData.place.id != ''&& $scope.IpData.place == 12312){
            place_id = $scope.IpData.place.id;  
            console.log(place_id);              
            delete $scope.IpData.place;         
            $scope.IpData.place = place_id;     
            console.log($scope.IpData.place);   
        };
        */
        console.log('expire_time:' + $scope.IpData.expire_time);
        if($scope.ip_detail_id == ''){
            $http({
                method: 'POST',
                url: '/ipinfo/ip_info_api/',
                data: JSON.stringify($scope.IpData),
            }).success(function(result){

                place_detail = Place.get({id: $scope.IpData.place},function(){ 
                    $scope.place_detail = place_detail.firm+','+place_detail.district;
                    console.log($scope.place_detail);
                });
                console.log($scope.IpData.outerip);
                Ip_Info.query(function(ip_id_find){
                    for( i in ip_id_find){
                        if($scope.IpData.outerip == ip_id_find[i].outerip){
                            ipturn = ip_id_find[i].id
                            };
                        };

                // add log 
                $scope.make_log = {};
                console.log('success');
                $scope.make_log.log_add = '';
                for( i in $scope.IpData){
                    if($scope.IpData[i] != ''){
                    $scope.make_log.log_add += i + '==>' + $scope.IpData[i] + ' '};
                };
                
                $scope.make_log.ip_info = ipturn;
                $scope.make_log.username = ipCookie('loginname');
                console.log($scope.make_log);
                

                $http({
                    method: 'POST',
                    url: '/ipinfo/log_save_api/',
                    data: JSON.stringify($scope.make_log),
                }).success(function(result){
                        console.log('log add success');
                }).error(function(err){
                        console.log('log add error');
                });
                // end add log

                $window.location.href = "/ipinfo/ip_info_add/"+ipturn;
                });
            }).error(function(err){
                // $window.location.href = "/login";
                console.log('error');
            });
        }else{
            console.log('update ready');
            $http({                                            
                method: 'PUT',                                
                url: '/ipinfo/ip_info_api/'+ $scope.ip_detail_id,                   
                data: JSON.stringify($scope.IpData),           
            }).success(function(result){                       
                place_detail = Place.get({id: $scope.IpData.place},function(){ 
                    $scope.place_detail = place_detail.firm+','+place_detail.district;                 
                    console.log($scope.place_detail);                  
                });                                                                  
                console.log('success');                        



                Ip_Info.query(function(ip_id_find){
                    for( i in ip_id_find){
                        if($scope.IpData.outerip == ip_id_find[i].outerip){
                            ipturn = ip_id_find[i].id;
                            log_id = i;
                            };
                        };
                
                console.log(log_id);
                // add log 
                $scope.make_log = {};
                console.log('success');
                $scope.make_log.log_add = '';
                console.log($scope.IpData);
                for( i in $scope.IpData){
                    if(i == 'log_save' || i == 'login_mode'|| i == 'project_info'|| i == '$get'|| i == '$remove'|| i == '$delete'|| i == '$save'){
                        console.log('');
                    }else{
                    if($scope.IpData[i] != $scope.ip_infos[log_id][i]){
                        console.log(i + $scope.ip_infos[log_id][i] + '   ' + $scope.IpData[i]);
                        $scope.make_log.log_add += i + ':' + $scope.ip_infos[log_id][i] + '==>' + $scope.IpData[i] + ' '
                        };
                    };
                };
                console.log($scope.make_log);
                if($scope.make_log.log_add == ''){
                    alert('没有数据变化');
                    return;
                }
                
                $scope.make_log.ip_info = ipturn;
                $scope.make_log.username = ipCookie('loginname');
                console.log($scope.make_log);
                

                $http({
                    method: 'POST',
                    url: '/ipinfo/log_save_api/',
                    data: JSON.stringify($scope.make_log),
                }).success(function(result){
                        console.log('log add success');
                }).error(function(err){
                        console.log('log add error');
                });
                // end add log

                //$window.location.href = "/ipinfo/ip_info_add/"+ipturn;
                });


                $scope.outer_msg = '';
                $scope.inner_msg = '';
                $scope.place_msg = '';
                
                // $window.location.href = "/setgame/mainpage";
            }).error(function(err){                            
                // $window.location.href = "/login";           
                console.log('error');                          
            });                                                
        }
    };
    // --------
    });

    if($scope.ip_detail_id === ""){              
            console.log($scope.ip_detail_id);    
    }                                            
    else{                                        
        Project_Info.query(function(pro_fore_key){
            window.operateEvents = {
                'click .remove': function (e, value, row, index) {
                alert('You click remove icon, row: ' + row.id);

                console.log(value, row, index);
                checklog = ipCookie('loginname');
                console.log(checklog);
                if(checklog === undefined){
                        alert('非法操作，请先登录！');
                            return;
                };

                id = {id: row.id};
                Project_Info.remove(id);
                alert(row.id + 'has been removed');
                
                $scope.make_log = {};
                $scope.make_log.ip_info = $scope.ip_detail_id;
                $scope.make_log.username = ipCookie('loginname');
                $scope.make_log.log_add = "project:" + " project name ==>" + row.pro_name + " project domain ==> " + row.domain + " project master ==> " + row.master + 'has been removed';
                console.log($scope.make_log);

                $http({
                    method: 'POST',
                    url: '/ipinfo/log_save_api/',
                    data: JSON.stringify($scope.make_log),
                }).success(function(result){
                        console.log('log add success');
                }).error(function(err){
                        console.log('log add error');
                });

                $window.location.href = "/ipinfo/ip_info_add/"+$scope.ip_detail_id;
                }
            };
            function operateFormatter(value, row, index) {
                return [
                    /*'<a class="see" href="javascript:void(0)" title="see more">',
                    '<i class="glyphicon glyphicon-eye-open"></i>',
                    '</a>',
                    '<a class="edit ml10" href="javascript:void(0)" title="Edit">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>',*/
                    '<a class="remove ml10" href="javascript:void(0)" title="Remove">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            };

            function rowStyles(row, index) {
                var classes = ['active', 'success', 'info', 'warning', 'danger'];
            
                return {};
            };

            table_project = [{
                field: 'state',
                checkbox: true
            }, {
                field:'id',
                title:'id'
            },{ 
                field: 'master',
                title: '项目负责人'
            }, {
                field: 'pro_name',
                title: '项目名称'
            }, {
                field: 'domain',
                title: '项目域名'
            }, {
                field: 'pro_dir',
                title: '项目目录'
            }, {
                field: 'operate',
                title: '项目操作',
                align: 'center',
                valign: 'middle',
                clickToSelect: false,
                formatter: operateFormatter,
                events: operateEvents
            }];

            projects = [];
            for(i in pro_fore_key){
                if($scope.ip_detail_id == pro_fore_key[i].ip_info){
                    projects.push(pro_fore_key[i]);
                    console.log(projects);
                }
            }
            console.log(projects);

            $('#table-project-basic').bootstrapTable({
                method: 'get',
                striped: true,
                cache: false,
                pagination: true,
                pageSize: 50,
                pageList: [10, 25, 50, 100, 200],
                search: true,
                showColumns: true,
                showRefresh: true,
                clickToSelect: true,
                columns: table_project,
                rowStyle: rowStyles,
                data: projects
            });
        });

        Login_Mode.query(function(log_fore_key){
            window.operateEvents = {
                'click .remove': function (e, value, row, index) {
                alert('You click remove icon, row: ' + row.id);
                console.log(value, row, index);
                checklog = ipCookie('loginname');
                console.log(checklog);
                if(checklog === undefined){
                        alert('非法操作，请先登录！');
                            return;
                };

                id = {id: row.id};
                Login_Mode.remove(id);
                alert(row.id + 'has been removed');

                $scope.make_log = {};
                $scope.make_log.ip_info = $scope.ip_detail_id;
                $scope.make_log.username = ipCookie('loginname');
                $scope.make_log.log_add = "sysuser:" + " system user ==> " + row.user + " system password ==> " + row.password + " " + 'has been removed';
                console.log($scope.make_log);

                $http({
                    method: 'POST',
                    url: '/ipinfo/log_save_api/',
                    data: JSON.stringify($scope.make_log),
                }).success(function(result){
                        console.log('log add success');
                }).error(function(err){
                        console.log('log add error');
                });


                $window.location.href = "/ipinfo/ip_info_add/"+$scope.ip_detail_id;
                }
            };
             function operateFormatter(value, row, index) {
                return [
                    /*'<a class="see" href="javascript:void(0)" title="see more">',
                    '<i class="glyphicon glyphicon-eye-open"></i>',
                    '</a>',
                    '<a class="edit ml10" href="javascript:void(0)" title="Edit">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>',*/
                    '<a class="remove ml10" href="javascript:void(0)" title="Remove">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            };

            function rowStyles(row, index) {
                var classes = ['active', 'success', 'info', 'warning', 'danger'];
            
                return {};
            };

            secrets = [];
            for(i in log_fore_key){
                if($scope.ip_detail_id == log_fore_key[i].ip_info){
                    secrets.push(log_fore_key[i]);
                    console.log(secrets);
                }
            }
            console.log(secrets);

            table_secret = [{
                field: 'state',
                checkbox: true
            }, {
                field:'id',
                title:'id'
            },{ 
                field: 'user',
                title: '用户名'
            },{ 
                field: 'password',
                title: '密码'
            }, {
                field: 'operate',
                title: '项目操作',
                align: 'center',
                valign: 'middle',
                clickToSelect: false,
                formatter: operateFormatter,
                events: operateEvents
            }];

            $('#table-Login-basic').bootstrapTable({
                method: 'get',
                striped: true,
                cache: false,
                pagination: true,
                pageSize: 50,
                pageList: [10, 25, 50, 100, 200],
                search: true,
                showColumns: true,
                showRefresh: true,
                clickToSelect: true,
                columns: table_secret,
                rowStyle: rowStyles,
                data: secrets
            });
        });

        Database_Info.query(function(database_infos){
            window.operateEvents = {
                'click .remove': function (e, value, row, index) {
                alert('You click remove icon, row: ' + row.id);
                console.log(value, row, index);
                checklog = ipCookie('loginname');
                console.log(checklog);
                if(checklog === undefined){
                        alert('非法操作，请先登录！');
                            return;
                };

                id = {id: row.id};
                Database_Info.remove(id);
                alert(row.id + 'has been removed');

                $scope.make_log = {};
                $scope.make_log.ip_info = $scope.ip_detail_id;
                $scope.make_log.username = ipCookie('loginname');
                $scope.make_log.log_add = "database: " + "database address ==> " + row.database_addr +  " database name ==> " + row.database_name + ' has been removed';
                console.log($scope.make_log);

                $http({
                    method: 'POST',
                    url: '/ipinfo/log_save_api/',
                    data: JSON.stringify($scope.make_log),
                }).success(function(result){
                        console.log('log add success');
                }).error(function(err){
                        console.log('log add error');
                });


                $window.location.href = "/ipinfo/ip_info_add/"+$scope.ip_detail_id;
                }
            };
             function operateFormatter(value, row, index) {
                return [
                    /*'<a class="see" href="javascript:void(0)" title="see more">',
                    '<i class="glyphicon glyphicon-eye-open"></i>',
                    '</a>',
                    '<a class="edit ml10" href="javascript:void(0)" title="Edit">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>',*/
                    '<a class="remove ml10" href="javascript:void(0)" title="Remove">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            };

            function rowStyles(row, index) {
                var classes = ['active', 'success', 'info', 'warning', 'danger'];
            
                return {};
            };


            table_database = [{
                field: 'state',
                checkbox: true
            }, {
                field:'database_addr',
                title:'数据库地址'
            },{ 
                field: 'database_conn_source',
                title: '数据库连接信息'
            },{ 
                field: 'database_name',
                title: '数据库名称'
            }, {
                field: 'operate',
                title: '项目操作',
                align: 'center',
                valign: 'middle',
                clickToSelect: false,
                formatter: operateFormatter,
                events: operateEvents
            }];

            data_infos = [];
            for( i in database_infos){
                console.log(i);
                if(database_infos[i].ip_info == $scope.ip_detail_id){
                    data_infos.push(database_infos[i]);
                };
            };
            console.log(data_infos);
                $('#table-database-basic').bootstrapTable({
                    method: 'get',
                    striped: true,
                    cache: false,
                    pagination: true,
                    pageSize: 50,
                    pageList: [10, 25, 50, 100, 200],
                    search: true,
                    showColumns: true,
                    showRefresh: true,
                    clickToSelect: true,
                    columns: table_database,
                    rowStyle: rowStyles,
                    data: data_infos
            });
        });

    };

});
            
