routeapp.controller('upload', ['$scope', 'Upload', function ($scope, Upload) {
    $scope.log = '';

    $scope.files = [];
    $scope.filename = [];

    angular.forEach(['mp3file', 'jpgfile'], function (key) {
        $scope.$watch(key, function (file) {
            if (file && file.length) {
                if(key == 'mp3file'){
                    $scope.filename.push('music_file');
                }else{
                    $scope.filename.push('music_img');
                };
                $scope.files.push(file[0]);
            };
        });
        console.log($scope.files);
    });

    $scope.startupload = function () {
            console.log($scope.files);
                Upload.upload({
                    url: '/music/music_api/',
                    method: 'POST',
                    file: $scope.files,
                    fileFormDataName: $scope.filename,
                    fields: {'username' :1},
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.log = 'progress: ' + progressPercentage + '% ' +
                                evt.config.file[0].name + evt.config.file[1].name;
                }).success(function (data, status, headers, config) {
                    $scope.log = 'file ' + config.file[0].name + ' ' + config.file[1].name + ' uploaded success' + '    ' + $scope.log;
                    $scope.$apply();
                }).error(function (data, status, headers, config) {
                     $scope.log = 'file ' + config.file[0].name + ' ' + config.file[1].name + ' uploaded failed' + '    ' + $scope.log;
                });
            };
}]);
