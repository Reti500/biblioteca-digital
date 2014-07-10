var app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

/*app.controller("CategoriasCtr", function($scope, Categoria, Producto, Archivo) {
    $scope.busquedas = false;
    $scope.Lightbox = false;

	$scope.seleccionDocumento = function(documento) {
        $scope.Lightbox = true;
        $scope.sinBlur = 'blur';
        $scope.current_file = documento;
    };

	$scope.cerrarLightbox = function() {
        $scope.Lightbox = false;
		$scope.sinBlur = '';
    };

    $scope.buscar = function($data){
        if($data) {
            $scope.busquedas = true;
            $scope.find = $data;
        }
    };

    $scope.closeSearch = function(){
        $scope.busquedas = false;
    };

    // INIT
    $scope.init = function () {
        $scope.getCategorias();
        $scope.getProductos();
        $scope.getArchivos();
    };

    $scope.getCategorias = function () {
        Categoria.get({}, function($data){
            $scope.categorias = $data.categorias;
        });
    };

    $scope.getProductos = function () {
        Producto.get({}, function($data){
            $scope.productos = $data.productos;
        });
    };

    $scope.getArchivos = function () {
        Archivo.get({}, function ($data) {
            $scope.documentos = $data.Archivos;
        })
    };

    //Esto oculta los otros módulos del buscador
    $scope.productoListado = true;
    $scope.documentosListado = true;

    //Esto controla las busquedas
    $scope.idCategoria = "";

    $scope.busquedaCategoria = [];
    $scope.busquedaCategoria.categoria_id = 0;
    $scope.busquedaProducto = [];
    $scope.busquedaProducto.producto_id = 0;
    $scope.busquedaProducto.categoria_id = 0;

    //Carga las busquedas
    *//*$http.get("/assets/js/fixtures.json").success(function (data) {
        $scope.categorias = data.Categorias;
        $scope.productos = data.Productos;
        $scope.documentos = data.Documentos;
    });*//*

    //Esto es una función que se dispara al seleccionar la categoría
    $scope.seleccionCategoria = function(categoria) {
        $scope.busquedaCategoria.categoria_id = categoria;
        $scope.productoListado = false;
        //Aqui detecto si cambio la categoria para ocultar los documentos
        if (categoria != $scope.idCategoria) {
            $scope.documentosListado = true;
            console.log("cambio el id");
        }
        $scope.idCategoria = categoria;
    };

    //Esto es una función que se dispara al seleccionar un producto
    $scope.seleccionProducto = function(categoria_id, producto_id) {
        console.log("la categoria es: " + categoria_id + " y el producto es: " + producto_id);
        $scope.busquedaProducto.producto_id = producto_id;
        $scope.busquedaProducto.categoria_id = categoria_id;
        $scope.documentosListado = false;
        $scope.strCat = categoria_id;
        $scope.strProd = producto_id;
    };
});*/

app.directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue;
            }
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});

app.config(function($provide) {
    $provide.decorator('$q', ['$delegate', '$rootScope', function($delegate, $rootScope) {
      var pendingPromisses = 0;
      $rootScope.$watch(
        function() { return pendingPromisses > 0; },
        function(loading) { $rootScope.loading = loading; }
      );
      var $q = $delegate;
      var origDefer = $q.defer;
      $q.defer = function() {
        var defer = origDefer();
        pendingPromisses++;
        defer.promise.finally(function() {
          pendingPromisses--;
        });
        return defer;
      };
      return $q;
    }]);
});

app.filter('searchfilter', [function() {
    return function(items, searchText){
        var filtered = [];
        searchText = String(searchText).toLowerCase();
        //if(searchText != "") {
            angular.forEach(items, function (item) {
                if (item.name.toLowerCase().indexOf(searchText) >= 0) filtered.push(item);
            });
        //};
        return filtered;
    };
}]);

app.filter('searchfilteruser', [function() {
    return function(items, searchText){
        var filtered = [];
        searchText = String(searchText).toLowerCase();
        if(searchText != "") {
            angular.forEach(items, function (item) {
                if (item.username.toLowerCase().indexOf(searchText) >= 0 || item.email.toLowerCase().indexOf(searchText) >= 0)
                    filtered.push(item);
            });
        };
        return filtered;
    };
}]);

app.filter('exact', function(){
  return function(items, match){
    var matching = [], matches, falsely = true;

    // Return the items unchanged if all filtering attributes are falsy
    angular.forEach(match, function(value, key){
      falsely = falsely && !value;
    });
    if(falsely){
      return items;
    }

    angular.forEach(items, function(item){ // e.g. { title: "ball" }
      matches = true;
      angular.forEach(match, function(value, key){ // e.g. 'all', 'title'
        if(!!value){ // do not compare if value is empty
          matches = matches && (item[key] === value);
        }
      });
      if(matches){
        matching.push(item);
      }
    });
    return matching;
  }
});