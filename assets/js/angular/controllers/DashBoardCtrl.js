app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('DashBoardCtrl', function($scope, $window){
    $scope.error = false;
    $scope.error_message = "";

    $scope.lightboxes = {
        "categorias": false,
        "productos": false,
        "archivos": false
    }

    $scope.openLightbox = function(light){
        $scope.lightboxes[light] = true;
    }

    $scope.closeLightbox = function (light) {
        $scope.lightboxes[light] = false;
    }
});