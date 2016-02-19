routeapp.controller('bakup_code_ctrl', function($scope, Project_Group) {
    $scope.project_groups = Project_Group.query();
});
