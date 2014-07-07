/*app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});*/

app.controller('LandingCtrl', function($scope, $window, Session, User){
    $scope.login = false;
    $scope.signup = false;
    $scope.forgot = false;
    $scope.error = false;
    $scope.error_message = "";

    $scope.lightbox = function(popup){
        switch(popup){
            case 'login':
                $scope.login = !$scope.login;
                break;
            case 'signup':
                $scope.signup = !$scope.signup;
                break;
            case 'forgot':
                $scope.forgot = !$scope.forgot;
                break;
        }
    };

    /*$scope.acceder = function(params){
        $scope.session = new Session(params);

        Session.create(params, function($data){
            console.log($data);
            if($data.state == "OK"){
                $window.location.href = '/interfaz';
            }else if($data.state == "VERIFIED"){
                $scope.user = angular.copy({})
                $scope.error = true;
                $scope.error_message = "Verifica el tu correo!!!";
            }else{
                $scope.user = angular.copy({})
                $scope.error = true;
                $scope.error_message = "Error en el usuario o contraseña";
            }
        }, function ($data) {
            $scope.error = true;
            $scope.error_message = "Faltan datos";
        })
    };*/

    $scope.nuevo = function(params){
        $scope.user = new User(params);

        User.create(params, function($data){
            console.log($data);
            if($data.state == 'OK'){
                $window.location.href = '/interfaz';
            }else{
                console.log($data);
            }
        });
    };
});