/*app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});*/

app.controller('SessionsCtrl', function($scope, $window, Session){
    /*$scope.acceder = function(params){
        $scope.session = new Session(params);

        Session.create(params, function($data){
            if($data.state == "OK"){
                $window.location.href = '/interfaz';
            }else if($data.state == "VERIFIED"){

            }else{
                console.log($data.state)
            }
        })
    };*/

    $scope.acceder = function(params){
        $scope.session = new Session(params);

        Session.create(params, function($data){
            console.log($data);
            if($data.state == "OK"){
                $window.location.href = '/interfaz';
            }else if($data.state == "VERIFIED"){
                $scope.user = angular.copy({})
                $scope.error = true;
                $scope.error_message = "Verifica tu correo!!!";
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