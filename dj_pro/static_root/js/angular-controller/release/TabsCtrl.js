app.controller('TabsCtrl', function($scope, $state){
    $scope.tabs = [
        { title:'欢迎页面', url:'welcome_page' },
        { title:'查询分支', url:'search_branch' },
        { title:'拉取代码', url:'pull_code' },
        { title:'发布代码', url:'release_code' },
        { title:'数据库操作', url:'database_update' },
        { title:'重启进程', url:'process_reset' },
        { title:'自定义操作', url:'costume_operation' },
        { title:'查看所有日志', url:'log_view' }
    ];
    $state.go('welcome_page');

});
