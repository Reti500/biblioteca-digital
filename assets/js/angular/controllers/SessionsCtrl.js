app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('SessionsCtrl', function($scope, $window, Session){
    $scope.acceder = function(params){
        $scope.session = new Session(params);

        Session.create(params, function($data){
            if($data.state == "ok"){
                $window.location.href = '/';
            }else{

            }
        })
    };
});