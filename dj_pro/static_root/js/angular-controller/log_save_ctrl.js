app.controller('log_save_ctrl',
function($scope, Log_Save){
    $scope.ip_detail_id = (window.location.pathname).split('/')[3];

    Log_Save.query(function(logs){
        table_log = [{
            field:'username',
            title:'用户'
        },{
            field: 'log_add',
            title: '用户操作'
        },{
            field: 'log_time',
            title: '记录时间'
        }];

        data_logs = [];
        for( i in logs){
            console.log(i);
            if(logs[i].ip_info == $scope.ip_detail_id){
                data_logs.push(logs[i]);
            };
        };
        
        $('#table-log-basic').bootstrapTable({
            method: 'get',
            striped: true,
            cache: false,
            search: true,
            columns: table_log,
            data: data_logs
        });
    });
});

