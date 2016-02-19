app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http','$rootScope', function ($http,$rootScope) {
    $rootScope,loadinfo = '';
    this.uploadFileToUrl = function(up_combine, uploadUrl){
        var fd = new FormData();
        for( key in up_combine){
            fd.append(key, up_combine[key]);
        }
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            $rootScope.loadinfo = 'upload successful!';
        })
        .error(function(){
            $rootScope.loadinfo = 'upload failed!';
        });
    };
}]);

app.controller('music_ctrl', ['$scope', 'ipCookie','fileUpload', 'User',function($scope, ipCookie,fileUpload,User){
    userid = '';
     User.query(function(users){
        usercookie = ipCookie('loginname');
        // console.log(users);
         for( i in users){
            if( users[i].username == usercookie){
            userid = users[i].id;
            // console.log(userid);
         };
     };
    });
    $scope.uploadFile = function(){
        $scope.loadinfo = '';
        if ( userid == '' || userid == undefined){
            $scope.loadinfo = 'please login first';
            return false };
        var up_combine = {'music_file':$scope.music_file,
                          'music_img':$scope.music_img,
                           'username':userid};
        
        // console.log(up_combine);
        var uploadUrl = "/music/music_api/";
        fileUpload.uploadFileToUrl(up_combine, uploadUrl);
    };
}]);

