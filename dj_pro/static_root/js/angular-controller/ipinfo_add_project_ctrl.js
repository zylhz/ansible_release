app.controller('ipinfo_add_project_ctrl',
function($scope, Project_Info, Ip_Info, Login_Mode, ipCookie, $http){
    $scope.Project = Project_Info.query();
    $scope.ip_infos = Ip_Info.query();
    $scope.Project_Data = {};
    $scope.Sys_Data = {};
    $scope.Project_Data.pro_name = '';
    $scope.Project_Data.domain = '';
    $scope.Project_Data.ip_info = '';
    
    $scope.ip_detail_id = (window.location.pathname).split('/')[3];
    
    Project_Info.query(function(Project_Data){
 
 
    // -------- 修改地址信息
        $scope.project_info_post = function() {
            checklog = ipCookie('loginname');
            console.log(checklog);
            if(checklog === undefined){
                alert('非法操作，请先登录！');
                return;
            };

            msg = '';
            $scope.Project_Data.ip_info = $scope.ip_detail_id;
            console.log($scope.Project_Data);
            var post = new Project_Info($scope.Project_Data);

            if($scope.Project_Data.pro_name == ''){
                msg = '项目名不能为空';
                $scope.projectdata_pro = msg;
            };
            if($scope.Project_Data.domain == ''){
                msg = '域名不能为空';
                $scope.projectdata_domain = msg;
            };
            /*
            for( i in Project_Data){
                if($scope.Project_Data.pro_name == Project_Data[i].pro_name){
                    console.log(Project_Data[i]);
                    msg = "项目名已存在:" + Project_Data[i].pro_name;
                    $scope.projectdata_pro = msg;
                    alert(msg);
                    return ;
                    };
                if($scope.Project_Data.domain == Project_Data[i].domain){
                    console.log(Project_Data[i]);
                    msg = "域名已存在:" + Project_Data[i].domain;
                    $scope.projectdata_domain = msg;
                    alert(msg);
                    return ;
                    };

                };
                */
            //地址信息检测结束

            //alert("数据将被修改");
            console.log($scope.Project_Data);
            $http({
                method: 'POST',
                url: '/ipinfo/project_info_api/',
                data: JSON.stringify($scope.Project_Data),
            }).success(function(result){
                console.log('success');


                $scope.make_log = {};
                $scope.make_log.ip_info = $scope.ip_detail_id;
                $scope.make_log.username = ipCookie('loginname');
                $scope.make_log.log_add = "Project_Data: " + "project name ==> " + $scope.Project_Data.pro_name + " project master ==> " + $scope.Project_Data.master + " project domain ==> " + $scope.Project_Data.domain + 'has been added';
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
            window.location.href = "/ipinfo/ip_info_add/" + $scope.ip_detail_id;
            }).error(function(err){
            // $window.location.href = "/login";
                console.log('error');
            });
        };
    // --------
    });

    
    Login_Mode.query(function(Sys_Data){
        // 添加用户密码
        $scope.pass_info_post = function() {
            checklog = ipCookie('loginname');
            console.log(checklog);
            if(checklog === undefined){
                alert('非法操作，请先登录！');
                return;
            };

            msg = '';
            $scope.Sys_Data.ip_info = $scope.ip_detail_id;
            console.log($scope.Sys_Data);
            var post = new Login_Mode($scope.Sys_Data);
            $http({
                method: 'POST',
                url: '/ipinfo/login_mode_api/',
                data: JSON.stringify($scope.Sys_Data),
                }).success(function(result){
                    console.log('success');

                    $scope.make_log = {};
                    $scope.make_log.ip_info = $scope.ip_detail_id;
                    $scope.make_log.username = ipCookie('loginname');
                    $scope.make_log.log_add = "system data: " + "user ==> " + $scope.Sys_Data.user + " " + " password ==> "+ $scope.Sys_Data.password + " " + 'has been added';
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
                    window.location.href = "/ipinfo/ip_info_add/" + $scope.ip_detail_id;
                    // $window.location.href = "/setgame/mainpage";
                }).error(function(err){
                    // $window.location.href = "/login";
                    console.log('error');
                });
            };
        // --------
        });
    });

