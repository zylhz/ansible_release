routeapp.controller('welcome_page_ctrl', function($scope, Project_Group, ipCookie, Member, Family) {
    $scope.project_id = (window.location.pathname).split('/')[3];
    console.log($scope.project_id);
    master_name = ipCookie('loginname');
    $scope.permit_pro_set = [];
    master_id = '';

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

    Member.query(function(mem){
        for(i in mem){
            if(mem[i].user == master_name){
                master_id = mem[i].id;
                members = mem[i];
                console.log(master_id);
                break;
            };
        }   
        if(master_id == ''){ 
            console.log('no user'); 
        }else if(master_name == 'admin'){
            $scope.permit_pro_set = Project_Group.query();
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
                    project_check = false;
                    for(i in $scope.permit_pro_set){
                        if($scope.project_id == $scope.permit_pro_set[i].id){
                            project_check = true;
                            break;
                        };
                    };
                    if($scope.project_id == ''){
                        return;
                    };
                    if(project_check == false){
                        alert("你没有权限访问");
                        window.location.href = "/release/mainpage/";
                    };
                });
            });
        };
    });


    if($scope.project_id != ''){
        Project_Group.get({id:$scope.project_id},function(item){
        $scope.project_group = item;
        console.log(item);
        });
    };
    $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/300',
      text: ['鼠标停留在图片','查询分支可搜','拉取版本不填写版本，则拉去当前版本','执行时请不要离开或点击左侧'][slides.length % 4] +
        ['上查看项目说明', '索到所有版本', '，选择所要拉的项目，批量拉取即可', '标签，否则将看不到日志'][slides.length % 4]
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide();
  }
});
