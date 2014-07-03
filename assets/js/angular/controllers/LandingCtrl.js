app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('LandingCtrl', function($scope, $window, Session){
    $scope.login = false;
    $scope.error = false;
    $scope.error_message = "";

    $scope.lightbox = function(){
        $scope.login = !$scope.login;
    };

    $scope.acceder = function(params){
        $scope.session = new Session(params);

        Session.create(params, function($data){
            console.log($data);
            if($data.state == "OK"){
                $window.location.href = '/interfaz';
            }else{
                $scope.user = angular.copy({})
                $scope.error = true;
                $scope.error_message = "Error en el usuario o contraseña";
            }
        }, function ($data) {
            $scope.error = true;
            $scope.error_message = "Faltan datos";
        })
    };
});