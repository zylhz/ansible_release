app.controller('game_login', ['$scope', 'md5', function($scope, md5) {
        $scope.domain = '';
        $scope.accid = '0';
        $scope.accname = '';
        $scope.tstamp = Math.round(new Date().getTime()/1000);
        $scope.fcm = 1; 
        $scope.serverid = '';
        $scope.key = 'uqee20110301';
        angular.forEach(['domain','accid','accname','serverid','key'], function (key) {
        $scope.$watch(key,function() {
        $scope.ticket = md5.createHash($scope.accid + $scope.accname + $scope.serverid + $scope.tstamp + $scope.fcm + $scope.key);
        $scope.login_url =  'http://' + $scope.domain + '/Start.aspx?accid=' + $scope.accid + '&accname=' + $scope.accname + '&tstamp=' + $scope.tstamp + '&fcm=' + $scope.fcm + '&serverid=' + $scope.serverid + '&ticket=' + $scope.ticket;
    });
});
}]);
