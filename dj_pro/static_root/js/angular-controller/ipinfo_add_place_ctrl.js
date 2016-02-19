app.controller('ipinfo_add_place_ctrl',
function($scope, Place, Ip_Info, ipCookie, $http){
    $scope.places = Place.query();
    $scope.ip_infos = Ip_Info.query();
    $scope.FirmData = {};
    $scope.FirmData.firm = '';
    $scope.FirmData.district = '';
    
    Place.query(function(firmdata){
 
 
    // -------- 修改地址信息
    $scope.firm_place_post = function() {
        checklog = ipCookie('loginname');
        console.log(checklog);
        if(checklog === undefined){
            alert('非法操作，请先登录！');
            return;
        };
        msg = '';
        console.log($scope.FirmData);
        var post = new Place($scope.FirmData);

        if($scope.FirmData.firm == ''){
            msg = '公司名不能为空';
        };
        if($scope.FirmData.district == ''){
            msg = '地区不能为空';
        };
        for( i in firmdata){
            if($scope.FirmData.firm == firmdata[i].firm && $scope.FirmData.district == firmdata[i].district){
                console.log(firmdata[i]);
                msg = "对象已存在:" + firmdata[i].firm + ',' + firmdata[i].district;
                };
            };
        $scope.firmdata_msg = msg;
        if(msg != ''){
            return;
        };
        //地址信息检测结束

       // alert("数据将被修改");
        // $scope.IpData.place = 1;
        console.log($scope.FirmData);
        $http({
            method: 'POST',
            url: '/ipinfo/place_api/',
            data: JSON.stringify($scope.FirmData),
        }).success(function(result){
            console.log('success');
            alert('信息添加成功！');
            window.location.href = "/ipinfo/ip_add_place";
        }).error(function(err){
        // $window.location.href = "/login";
            console.log('error');
        });
    };
    // --------
    });


});
