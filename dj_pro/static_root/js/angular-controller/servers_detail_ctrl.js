app.controller('servers_detail_ctrl', function($scope, Servers_Info) {
    // Get all posts
    
    eth1 = (window.location.pathname).split('/')[3];
    server = Servers_Info.get({eth1:eth1},function(){
        console.log(server.eth0);

        server.cpu_info = eval("("+server.cpu_info+")");
        server.disk_info = eval("("+server.disk_info+")");
        server.memory_info = eval("("+server.memory_info+")");
        server.netio_info = eval("("+server.netio_info+")");
        server.sys_process_info = eval("("+server.sys_process_info+")");
        server.use_time_info = eval("("+server.use_time_info+")");

        table_detail_base = [{
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
        },{
            field:'start_time',
            title:'start_time',
        },{
            field:'login_user_num',
            title:'count_user'
        }];

        detail_base_data = [{
            'eth0':server.eth0,
            'eth1':server.eth1,
            'hostname':server.hostname,
            'update_time':server.update_time,
            'start_time':server.use_time_info.start_time,
            'login_user_num':server.use_time_info.count_user
        }];

        $('#table-detail_base').bootstrapTable({
            method: 'get',
            cache: false,
            columns: table_detail_base,
            data: detail_base_data
        });

        table_detail_memory = [{
            field:'mem_used_percent',
            title:'mem_used_percent'
        },{ 
            field:'mem_total',
            title:'mem_total'
        },{ 
            field:'mem_free',
            title:'mem_free'
        },{ 
            field:'swap_used_percent',
            title:'swap_used_percent'
        },{
            field:'swap_total',
            title:'swap_total'
        },{
            field:'swap_free',
            title:'swap_free'
        }];

        detail_memory_data = [{
            'mem_used_percent':server.memory_info.mem.used_percent,
            'mem_total':server.memory_info.mem.total,
            'mem_free':server.memory_info.mem.free,
            'swap_used_percent':server.memory_info.swap.used_percent,
            'swap_total':server.memory_info.swap.total,
            'swap_free':server.memory_info.swap.free
        }];
        console.log(detail_memory_data);
        
        $('#table-detail_memory').bootstrapTable({
            method: 'get',
            cache: false,
            columns: table_detail_memory,
            data: detail_memory_data
        }); 



        table_detail_cpu = [{
            field:'cpu',
            title:'cpu'
        },{ 
            field:'idle',
            title:'idle'
        },{ 
            field:'usertime',
            title:'usetime'
        },{
            field:'systime',
            title:'systime'
        }];
        
        detail_cpu_data = [];
        delete server.cpu_info['cpu_num'];
        for( i in server.cpu_info){
            detail_cpu_data.push({
            'cpu':i,
            'idle':server.cpu_info[i].idle,
            'usertime':server.cpu_info[i].usertime,
            'systime':server.cpu_info[i].systime
            });
        };
        console.log(detail_cpu_data);

        $('#table-detail_cpu').bootstrapTable({
            method: 'get',
            cache: false,
            columns: table_detail_cpu,
            data: detail_cpu_data
        });


        table_detail_mount = [{
            field:'mountpoint',
            title:'mountpoint'
        },{ 
            field:'total',
            title:'total(M)'
        },{ 
            field:'percent',
            title:'percent(%)'
        },{ 
            field:'free',
            title:'free(M)'
        },{ 
            field:'used',
            title:'used(M)'
        }];
        
        detail_mount_data = [];
        for( i in server.disk_info){
            detail_mount_data.push({
                'mountpoint':server.disk_info[i].mountpoint,
                'total':server.disk_info[i].total,
                'percent':server.disk_info[i].percent,
                'free':server.disk_info[i].free,
                'used':server.disk_info[i].used
            });
        };
        console.log(detail_mount_data);
        $('#table-detail_mount').bootstrapTable({
            method: 'get',
            cache: false,
            columns: table_detail_mount,
            data: detail_mount_data
        });

            
        table_detail_netio = [{
            field:'packets_sent',
            title:'packets_sent(bit)'
        },{ 
            field:'packets_recv',
            title:'packets_recv(bit)'
        },{ 
            field:'bytes_sent',
            title:'bytes_sent(bit)'
        },{ 
            field:'bytes_recv',
            title:'bytes_recv(bit)'
        }];
        
        detail_netio_data = [{
            'packets_sent':server.netio_info.packets_sent,
            'packets_recv':server.netio_info.packets_recv,
            'bytes_sent':server.netio_info.bytes_sent,
            'bytes_recv':server.netio_info.bytes_recv
        }];
        console.log(detail_netio_data);
        $('#table-detail_netio').bootstrapTable({
            method: 'get',
            cache: false,
            columns: table_detail_netio,
            data: detail_netio_data
        }); 


        table_detail_process = [{
            field:'monitor_service',
            title:'monitor_service'
        },{
            field:'pid',
            title:'pid'
        },{
            field:'action',
            title:'action',
            align: 'center',
            valign: 'middle'
            //clickToSelect: false,
            //formatter: operateFormatter,
            //events: operateEvents
        }];
        detail_process_data = [];
        for( i in server.sys_process_info){
            if(server.sys_process_info[i] == "[]"){
                server.sys_process_info[i] = 'no such service'};
            detail_process_data.push({
                'monitor_service':i,
                'pid':server.sys_process_info[i],
            });
        };
        console.log(detail_process_data);
        $('#table-detail_process').bootstrapTable({
            method: 'get',
            cache: false,
            columns: table_detail_process,
            data: detail_process_data
        }); 








    });

});
