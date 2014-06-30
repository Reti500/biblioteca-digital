app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('UserCtrl', function($scope, User){
    $scope.nuevo = function(params){
        $scope.user = new User(params);
        console.log($scope.user);
        User.create(params, function($data){
            console.log($data);
        })
    }
});