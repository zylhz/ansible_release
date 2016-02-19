app.controller('servers_info_ctrl', function($scope, $window,Servers_Info) {
    // Get all posts
    $scope.servers_infos = Servers_Info.query();
    
    servers_only = Servers_Info.get({eth1:'192.168.70.130'});
    console.log(servers_only);

    Servers_Info.query(function(infos){
        $scope.infos = [];
        for(i in infos){
                $scope.infos.push(
                    {'eth0': infos[i].eth0,
                    'eth1': infos[i].eth1,
                    'hostname': infos[i].hostname,
                    'cpu_info': eval("("+infos[i].cpu_info+")"),
                    'memory_info': eval("("+infos[i].memory_info+")"),
                    'disk_info': eval("("+infos[i].disk_info+")"),
                    'netio_info': eval("("+infos[i].netio_info+")"),
                    'use_time_info': eval("("+infos[i].use_time_info+")"),
                    'sys_process_info': eval("("+infos[i].sys_process_info+")"),
                    'update_time' : infos[i].update_time,
                    });
            };

            // deal event and format
            window.operateEvents = {
                'click .see': function (e, value, row, index) {
                alert('see more about: ' + row.eth1);
                 $window.location.href = "/servers/base_info/"+row.eth1;
                },
                'click .edit': function (e, value, row, index) {
                alert('You click edit icon, row: ' + JSON.stringify(row));
                console.log(value, row, index);
                },
                'click .remove': function (e, value, row, index) {
                alert('You click remove icon, row: ' + row.eth1);
                console.log(value, row, index);
                remove_server = {eth1:row.eth1};
                Servers_Info.remove(remove_server);
                alert(row.eth1 + 'has been removed');
                $window.location.href = "/servers/base_info";
                }
            };
             function operateFormatter(value, row, index) {
                return [
                    '<a class="see" href="javascript:void(0)" title="see">',
                    '<i class="glyphicon glyphicon-eye-open"></i>',
                    '</a>',
                    '<a class="edit ml10" href="javascript:void(0)" title="Edit">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>',
                    '<a class="remove ml10" href="javascript:void(0)" title="Remove">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            };

        function rowStyles(row, index) {
            var classes = ['active', 'success', 'info', 'warning', 'danger'];
            
            console.log(row.memory_used.split('%')[0]);
            if (row.memory_used.split('%')[0] > 80) {
                return {
                    classes: classes[4]
                };
            }
            return {};
        };

        $scope.info_base = [];
        for(i = 0; i < $scope.infos.length;i++){
            $scope.info_base.push({
            'eth0': $scope.infos[i].eth0,
            'eth1': $scope.infos[i].eth1,
            'hostname': $scope.infos[i].hostname,
            'cpu_num': $scope.infos[i].cpu_info.cpu_num,
            'memory_used': $scope.infos[i].memory_info.mem.used_percent + '%',
            'use_time': $scope.infos[i].use_time_info.start_time,
            'update_time' : $scope.infos[i].update_time
            });
            }; 

            table_base = [{
                    field: 'state',
                    checkbox: true
                }, {
                    field:'eth0',
                    title:'eth0'
                },{ 
                    field:'eth1',
                    title:'eth1'
                },{ 
                    field:'hostname',
                    title:'hostname'
                },{         
                    field:'update_time',
                    title:'update_time'
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center',
                    valign: 'middle',
                    clickToSelect: false,
                    formatter: operateFormatter,
                    events: operateEvents
                }];
            
        
            table_base.splice(4,0,
            {   
                    field:'cpu_num',
                    title:'cpu_num'
            },{ 
                    field:'memory_used',
                    title: 'memory_used'
            },{ 
                    field:'use_time',
                    title:'use_time'
            });
            table_sys_basic = table_base.slice();



            console.log(table_base);
            console.log(table_sys_basic);
            $('#table-sys-basic').bootstrapTable({
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
            columns: table_base,
            rowStyle: rowStyles,
            data: $scope.info_base
            });
            /*$('#table-sys-basic1').bootstrapTable({
                columns: [{
                    field:'eth0',
                    title:'eth0'
                },{ 
                    field:'eth1',
                    title:'eth1'
                },{ 
                    field:'hostname',
                    title:'hostname'
                    }]*/
        });
});
