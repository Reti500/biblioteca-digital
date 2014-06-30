app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('SessionsCtrl', function($scope, Session){
    $scope.init = function(){
        Session.show({}, function($data){
            console.log($data);
        });
    }

    $scope.acceder = function(params){
        $scope.session = new Session(params);

        Session.create(params, function($data){
            console.log($data);
        })
    }

    $scope.nuevo = function(params){
        $scope.user = new User(params);

        User.create(params, function($data){
            console.log($data);
        })
    }
});