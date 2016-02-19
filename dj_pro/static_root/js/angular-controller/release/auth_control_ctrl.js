routeapp.controller('auth_control', function($scope, Family, Member, Project_Group, Group, $http) {
    Project_Group.query(function(project_groups){

        $scope.groups = $scope.all_groups = Family.query();    
        $scope.single_members = Member.query();
    
        $scope.change_group = function(ch_group_name){
            $scope.groupid = ch_group_name.id
            console.log($scope.groupid);
                $scope.init_multi = function(){
                    $('#public-select').multiSelect('deselect_all');
                    $('#user-select').multiSelect('deselect_all');
                };
        

            all_pro = [];
            selected_pro = [];
            not_selected_pro = [];
            for(i in project_groups){
                all_pro.push(project_groups[i].pro_group_name);
            };
            Family.get({id: $scope.groupid} , function(family){
                group_name = family.group_name.split(',');
                selected_pro = family.permit_pro.split(',');
                all_pro.filter(function(n) {
                    if(selected_pro.indexOf(n) == -1){
                        not_selected_pro.push(n);
                    };
                });
                console.log('not_selected_pro');
                console.log(not_selected_pro);
                
                for(i in selected_pro){
                    $('#public-select').append('<option value=\''+ selected_pro[i] +'\' selected>' + selected_pro[i] + '</option>');
                };

                for(i in not_selected_pro){
                    $('#public-select').append('<option value=\''+ not_selected_pro[i] +'\'>' + not_selected_pro[i] + '</option>');
                };
            


                $('#public-select').multiSelect({
                    selectableHeader: "<div class='custom-header'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span>未授权项目</div>",
                    selectionHeader: "<div class='custom-header'><span class='glyphicon glyphicon-ok' aria-hidden='true'></span>已授权项目</div>",
                    afterSelect: function(values){
                        selected_pro.push(values[0]);
                        console.log("Select value: "+values);
                        console.log(selected_pro);
                        selected_pro_str = selected_pro.join(',');
                        console.log(selected_pro_str);
                    },
                    afterDeselect: function(values){
                        selected_pro.splice( selected_pro.indexOf(values[0]), 1 );
                        console.log("Deselect value: "+values);
                        selected_pro_str = selected_pro.join(',');
                        console.log(selected_pro_str);
                    }
            
                });

                $('#select-all').click(function(){
                    $('#public-select').multiSelect('select_all');
                    return false;
                });

                $('#deselect-all').click(function(){
                    $('#public-select').multiSelect('deselect_all');
                    return false;
                });

                

                $scope.group_post = function(){
                    family.permit_pro = selected_pro_str;
                    $http.put('/auth_control/family_api/' + $scope.groupid + '/', 
                        family
                    ).success(function(res){
                        alert('添加成功');
                    }).error(function(err){
                        alert('添加错误');
                    });
                };

                Member.query(function(all_users){
                    selected_user = [];
                    not_selected_user = [];
                    all_user = [];
                    console.log(all_user);
                    console.log($scope.groupid);
                    for(i in all_users){
                        all_user.push(all_users[i].user);
                        if(all_users[i].group_id == $scope.groupid){
                            selected_user.push(all_users[i].user);
                        };
                    };
                    console.log(selected_user);
                    all_user.filter(function(n) {
                        if(selected_user.indexOf(n) == -1){
                            not_selected_user.push(n);
                        };
                    });
                    console.log(not_selected_user);

                    for(i in selected_user){
                        console.log(selected_user[i]);
                        $('#user-select').append('<option value=\''+ selected_user[i] +'\' selected>' + selected_user[i] + '</option>');
                    };

                    for(i in not_selected_user){
                        console.log(not_selected_user[i]);
                        $('#user-select').append('<option value=\''+ not_selected_user[i] +'\'>' + not_selected_user[i] + '</option>');
                    };
            
                    
                    $('#user-select').multiSelect({
                        selectableHeader: "<div class='custom-header'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span>未成为该组用户</div>",
                        selectionHeader: "<div class='custom-header'><span class='glyphicon glyphicon-ok' aria-hidden='true'></span>已成为该组用户</div>",
                        afterSelect: function(values){
                            console.log("Select user: "+values);
                            selected_user.push(values[0]);
                            console.log(selected_user);
                        },
                        afterDeselect: function(values){
                            selected_user.splice( selected_user.indexOf(values[0]), 1 );
                            console.log(selected_user);
                        }
            
                    });
                    $('#user-select-all').click(function(){
                        $('#user-select').multiSelect('select_all');
                        return false;
                    });

                    $('#user-deselect-all').click(function(){
                        $('#user-select').multiSelect('deselect_all');
                        return false;
                    });

                    console.log(selected_user);
                    $scope.user_post = function(){
                        not_selected_user = all_user;
                        for(i in selected_user){
                                not_selected_user.splice( all_user.indexOf(selected_user[i]), 1 );
                                    
                                for(j in all_users){
                                    if(all_users[j].user == selected_user[i]){
                                        useritem = all_users[j];
                                        console.log(useritem);
                                    };
                                };
                                console.log(useritem);
                                useritem.group_id = $scope.groupid;
                                $http.put('/auth_control/member_api/' + useritem.id + '/', 
                                useritem
                                ).success(function(res){
                                    console.log('user添加成功');
                                }).error(function(err){
                                    console.log('user添加错误');
                                });
                        };

                        for(i in not_selected_user){
                                 
                                for(j in all_users){
                                    if(all_users[j].user == not_selected_user[i]){
                                        useritem = all_users[j];
                                        console.log(useritem);
                                        if(useritem.group_id == $scope.groupid){
                                            useritem.group_id = '';
                                            $http.put('/auth_control/member_api/' + useritem.id + '/', 
                                            useritem
                                            ).success(function(res){
                                                console.log('user删除成功');
                                            }).error(function(err){
                                                console.log('user删除错误');
                                            });
                                        };
                                    };
                                };
                        };

                    };

                });


            });
        };


        $scope.group_delete = function(){
            console.log($scope.delete_group);
            $http.delete('/auth_control/family_api/' + $scope.delete_group.id 
            ).success(function(res){
                alert('删除成功');
            }).error(function(err){
                alert('删除错误');
            });
            $http.delete('/groups/' + $scope.delete_group.group
            ).success(function(res){
                alert('id删除成功');
            }).error(function(err){
                alert('删除错误');
            }); 
            
        };

        $scope.group_add = function(){
            Group.query(function(allgroups){
                for(i in allgroups){
                    if(allgroups[i].group_name == $scope.groupname){
                        alert('已经存在用户组' + $scope.groupname);
                        return;
                    }
                };
                
                groupadd = {};
                groupadd.name = $scope.groupname;
                $http.post('/groups/', 
                    groupadd
                ).success(function(res){
                    groupadd_id = res.id;
                    $http.post('/auth_control/family_api/', {
                        group: groupadd_id
                    }).success(function(res){
                        alert('id添加成功');
                    }).error(function(err){
                        alert('添加错误');
                    }); 
                    alert('添加成功');
                }).error(function(err){
                    alert('添加错误');
                });
            });
        };

        $scope.change_user_per = function(){
            console.log($scope.ch_user_name);
            $scope.single_userid = $scope.ch_user_name.id;
            console.log($scope.ch_user_name.id);
            $scope.init_single_multi = function(){
                $('#single-select').multiSelect('deselect_all');
            };
        

            all_pro = [];
            selected_pro = [];
            not_selected_pro = [];
            for(i in project_groups){
                all_pro.push(project_groups[i].pro_group_name);
            };
            console.log(all_pro);
            Member.get({id: $scope.single_userid} , function(member){
                selected_pro = member.permit_pro.split(',');
                all_pro.filter(function(n) {
                    if(selected_pro.indexOf(n) == -1){
                        not_selected_pro.push(n);
                    };
                });
                console.log('not_selected_pro');
                console.log(not_selected_pro);
                
                for(i in selected_pro){
                    $('#single-select').append('<option value=\''+ selected_pro[i] +'\' selected>' + selected_pro[i] + '</option>');
                };

                for(i in not_selected_pro){
                    $('#single-select').append('<option value=\''+ not_selected_pro[i] +'\'>' + not_selected_pro[i] + '</option>');
                };
            


                $('#single-select').multiSelect({
                    selectableHeader: "<div class='custom-header'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span>未授权项目</div>",
                    selectionHeader: "<div class='custom-header'><span class='glyphicon glyphicon-ok' aria-hidden='true'></span>已授权项目</div>",
                    afterSelect: function(values){
                        selected_pro.push(values[0]);
                        console.log("Select value: "+values);
                        console.log(selected_pro);
                        selected_pro_str = selected_pro.join(',');
                        console.log(selected_pro_str);
                    },
                    afterDeselect: function(values){
                        selected_pro.splice( selected_pro.indexOf(values[0]), 1 );
                        console.log("Deselect value: "+values);
                        selected_pro_str = selected_pro.join(',');
                        console.log(selected_pro_str);
                    }
            
                });

                $('#single-select-all').click(function(){
                    $('#single-select').multiSelect('select_all');
                    return false;
                });
                $('#single-deselect-all').click(function(){
                    $('#single-select').multiSelect('deselect_all');
                    return false;
                });

                $scope.single_user_post = function(){
                    member.permit_pro = selected_pro_str;
                    $http.put('/auth_control/member_api/' + $scope.single_userid + '/', 
                        member
                    ).success(function(res){
                        alert('添加成功');
                    }).error(function(err){
                        alert('添加错误');
                    });
                };
            });
        };
    });
});

