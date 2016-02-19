routeapp.controller('release_main', function($scope, Project_Group, ipCookie, Member, Family) {

    $scope.url_redirect = function(url){
        console.log(url);
        window.location.href = url;
    };

    $scope.project_groups = Project_Group.query();
    $scope.status = {
        isopen: false
    };

    function union_arrays (x, y) {
      var obj = {};
      for (var i = x.length-1; i >= 0; -- i)
         obj[x[i]] = x[i];
      for (var i = y.length-1; i >= 0; -- i)
         obj[y[i]] = y[i];
      var res = []
      for (var k in obj) {
        if (obj.hasOwnProperty(k))  // <-- optional
          res.push(obj[k]);
      }
      return res;
    }

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.changeurl = function(url_id) {
        console.log(url_id);
        window.location.href = "/release/mainpage/" + url_id;
    };

    $scope.turn_url = function(t_url){
        console.log(t_url);
        window.location.href = t_url;
    };

    $scope.project_name = "请选择项目";
    $scope.project_id = (window.location.pathname).split('/')[3];
    master_name = ipCookie('loginname');
    $scope.admin_tool = false;
    if(ipCookie('loginname') == 'admin'){
        $scope.admin_tool = true;
    };
    console.log($scope.admin_tool);
    $scope.permit_pro_set = [];
    master_id = '';
    Member.query(function(mem){
        for(i in mem){
            if(mem[i].user == master_name){
                master_id = mem[i].id;
                members = mem[i];
                console.log(master_id);
                break;
            };
        }
        if(master_name == 'admin'){
            $scope.permit_pro_set = Project_Group.query();
        }else if(master_id == ''){
            console.log('no user');
        }else{
            group_id = members.group_id
            permit_pro_single = members.permit_pro.split(',');
            console.log(permit_pro_single);
            Family.get({id: group_id},function(family){
                permit_pro_group = family.permit_pro.split(',');
                console.log(permit_pro_group);
                permit_pro = union_arrays(permit_pro_single, permit_pro_group);
                console.log(permit_pro);
                Project_Group.query(function(projects){
                    for(i in projects){
                        for(j in permit_pro){
                            if(projects[i].pro_group_name == permit_pro[j]){
                                $scope.permit_pro_set.push(projects[i]);
                            };
                        };
                    };
                });
            });
        };
    });


    Project_Group.query(function(projects){
        for(i in projects){
            if(projects[i].id == $scope.project_id){
                    $scope.project_name = projects[i].pro_group_name;
                    break;
                };
            };
    });
});
