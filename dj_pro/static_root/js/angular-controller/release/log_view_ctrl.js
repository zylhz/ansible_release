routeapp.filter('offset', function() {
    return function(input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
        };
});

routeapp.controller("PaginationCtrl", function($scope, Log_Save) {
    $scope.project_id = (window.location.pathname).split('/')[3];
    $scope.itemsPerPage = 10;
    $scope.currentPage = 0;
    $scope.catagorys = ['拉取git', '发布版本', '重启进程', '数据库', '自定义'];
    $scope.items = [];
    Log_Save.query(function(all_items){
        for(i in all_items){
            if(all_items[i].pro_group == $scope.project_id){
                $scope.items.push(all_items[i]);
            };
        };
    
    temp_origin = $scope.items;
    $scope.changecata = function() {
        temp = [];
        tach = {'拉取git': 'pull', '发布版本': 'release', '重启进程': 'process', '数据库': 'database', '自定义': 'costume'};
        console.log(tach[$scope.catagory]);
        for( i in temp_origin){
            console.log(temp_origin[i]['log_type'])
            if(temp_origin[i]['log_type'] == tach[$scope.catagory])
                temp.push(temp_origin[i]);
            };
            console.log(temp)
            if(temp == ''){
                temp.push({log_complex :'没有数据'});
            };
            $scope.items = temp;
        };

    $scope.range = function() {
        var rangeSize = 5;
        var ret = [];
        var start;

        start = $scope.currentPage;
        if ( start > $scope.pageCount()-rangeSize ) {
            start = $scope.pageCount()-rangeSize+1;
        }

        for (var i=start; i<start+rangeSize; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "disabled" : "";
    };

    $scope.pageCount = function() {
        return Math.ceil($scope.items.length/$scope.itemsPerPage)-1;
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };

    $scope.setPage = function(n) {
        $scope.currentPage = n;
    };

    });
});
