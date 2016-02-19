app.controller('ipinfo_main_ctrl', function($scope, $window, Ip_Info, ipCookie) {
    // Get all posts
    $scope.ip_infos = Ip_Info.query();
    

    Ip_Info.query(function(infos){
        $scope.infos = [];

            // deal event and format
            window.operateEvents = {
                'click .see': function (e, value, row, index) {
                alert('see more about: ' + row.row);
                 $window.location.href = "/ipinfo/ip_info_api/"+row.id;
                },
                'click .edit': function (e, value, row, index) {
                // alert('You click edit icon, row: ' + JSON.stringify(row['id']));
                $window.location.href = "/ipinfo/ip_info_add/"+row['id'];
                console.log(value, row, index);
                },
                'click .remove': function (e, value, row, index) {
                console.log(value, row, index);
                checklog = ipCookie('loginname');
                console.log(checklog);
                if(checklog === undefined){
                    alert('非法操作，请先登录！');
                    return;
                };
                id = {id: row.id};
                Ip_Info.remove(id);
                alert(row.id + 'has been removed');
                $window.location.href = "/ipinfo/ip_info_main";
                }
            };

            function operateFormatter(value, row, index) {
            return [
                    /*'<a class="see" href="javascript:void(0)" title="see more">',
                    '<i class="glyphicon glyphicon-eye-open"></i>',
                    '</a>',*/
                    '<a class="edit ml10" href="javascript:void(0)" title="Edit">',
                        '<i class="glyphicon glyphicon-edit">&nbsp;&nbsp;</i>',
                    '</a>',
                    '<a class="remove ml10" href="javascript:void(0)" title="Remove">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('   ');
            };

            function rowStyles(row, index) {
                var classes = ['active', 'success', 'info', 'warning', 'danger'];
                today = new Date()
                try{
                    log_time = row.expire_time.split('T')[0];
                    log_time_Date = new Date(
                            log_time.split('-')[0],
                            log_time.split('-')[1]-1,
                            log_time.split('-')[2]
                            );


                    if (log_time_Date - today < 86400000 * 20) {   //86400000 is one day
                            return {
                            classes: classes[4]
                        };
                    }; 
                }catch(e){
                    console.log('pass');
                };
                return {};
                
            };

            table_base = [{
                    field: 'state',
                    checkbox: true
                }, {
                    field:'master_machine',
                    title: 'master_ip'
                },{ 
                    field:'place_source',
                    title: 'provider'
                },{ 
                    field:'machine_name',
                    title:'machine_name'
                },{ 
                    field:'outerip',
                    title:'outerip'
                },{         
                    field:'innerip',
                    title:'innerip'
                },{
                    field:'cpu',
                    title:'cpu'
                },{         
                    field:'memory',
                    title:'memory(M)'
                },{         
                    field:'expire_time',
                    title:'expire_time'
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center',
                    valign: 'middle',
                    clickToSelect: false,
                    formatter: operateFormatter,
                    events: operateEvents
                }];
            

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
                showToggle: true,
                showExport: true,
                columns: table_base,
                rowStyle: rowStyles,
                data: infos
            });
        });
});
