app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('UserCtrl', function($scope, $window, User){
    $scope.nuevo = function(params){
        $scope.user = new User(params);

        User.create(params, function($data){
            console.log($data);
            if($data.state == 'ok'){
                $window.location.href = '/';
            }else{
                console.log($data);
            }
        })
    }
});