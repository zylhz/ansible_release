var routeapp = angular.module('RouteApp', ['ngResource','ipCookie','ui.bootstrap','ui.router','angular-md5','base64','ngFileUpload']);
    routeapp.config(function($interpolateProvider) { 
      $interpolateProvider.startSymbol('((');
      $interpolateProvider.endSymbol('))');
    })
    routeapp.config(function($stateProvider, $locationProvider){
    $stateProvider
        .state('welcome_page', {                //备份代码
            templateUrl: "/release/welcome_page/",
        })
        .state('search_branch', {
            templateUrl: "/release/search_branch/"
        })
        .state('pull_code', {
            templateUrl: "/release/pull_code/"
        })
        .state('release_code', {
            templateUrl: "/release/release_code/"
        })
        .state('database_update', {
            templateUrl: "/release/database_update/"
        })
        .state('process_reset', {
            templateUrl: "/release/process_reset/"
        })
        .state('costume_operation', {
            templateUrl: "/release/costume_operation/"
        })
        .state('log_view', {
            templateUrl: "/release/log_view/"
        })
         $locationProvider.html5Mode(true);
    });
    routeapp.run(
    function($http) {
        //$http.defaults.headers.post['X-CSRFToken'] = $.cookie('csrftoken');
        // Add the following two lines
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    });

var app = angular.module('MyApp', ['angularSoundManager','ngResource','ipCookie','ui.bootstrap','ui.router','angular-md5','base64','ngFileUpload']);
    app.config(function($interpolateProvider) { 
      $interpolateProvider.startSymbol('((');
      $interpolateProvider.endSymbol('))');
    });
    app.run(
    function($http) {
        //$http.defaults.headers.post['X-CSRFToken'] = $.cookie('csrftoken');
        // Add the following two lines
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    });

angular.element(document).ready(function() {
            var addroute = document.getElementById("addroute");
            angular.bootstrap(addroute, ["MyApp", "RouteApp"]);

            var pureapp = document.getElementById("pureapp");
            angular.bootstrap(pureapp, ["MyApp"]);
});
