(function () {
    this.app = angular.module("bibliotecaTelmex", []), this.app.controller("InterfazBiblio", ["$scope", function (o) {
        return o.Lightbox = !1, o.seleccionDocumento = function (t) {
            return o.Lightbox = !0, o.sinBlur = "blur"
        }, o.cerrarLightbox = function () {
            return o.Lightbox = !1, o.sinBlur = ""
        }
    }]), this.app.controller("CategoriasCtr", ["$scope", "$http", function (o, t) {
        return o.productoListado = !0, o.documentosListado = !0, o.idCategoria = "", o.busquedaCategoria = [], o.busquedaCategoria.categoria_id = 0, o.busquedaProducto = [], o.busquedaProducto.producto_id = 0, o.busquedaProducto.categoria_id = 0, t.get("/assets/js/fixtures.json").success(function (t) {
            return o.categorias = t.Categorias, o.productos = t.Productos, o.documentos = t.Documentos
        }), o.seleccionCategoria = function (t) {
            return o.busquedaCategoria.categoria_id = t, o.productoListado = !1, t !== o.idCategoria && (o.documentosListado = !0, console.log("cambio el id")), o.idCategoria = t
        }, o.seleccionProducto = function (t, e) {
            return console.log("la categoria es: " + t + " y el producto es: " + e), o.busquedaProducto.producto_id = e, o.busquedaProducto.categoria_id = t, o.documentosListado = !1
        }
    }]), this.app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    })
}).call(this);

/* **********************************************
     Begin app.js
********************************************** */

var app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
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

app.directive('confirmationNeeded', function () {
  return {
    priority: 1,
    terminal: true,
    link: function (scope, element, attr) {
      var msg = attr.confirmationNeeded || "Are you sure?";
      var clickAction = attr.ngClick;
      element.bind('click',function () {
        if ( window.confirm(msg) ) {
          scope.$eval(clickAction)
        }
      });
    }
  };
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

app.filter('exact', [function() {
    return function(items, searchText){
        var filtered = [];
        searchText = String(searchText).toLowerCase();
        if(searchText != "") {
            angular.forEach(items, function (item) {
                if (item.categoria.toLowerCase() === searchText)
                    filtered.push(item);
            });
        };
        return filtered;
    };
}]);

/* **********************************************
     Begin CategoriasCtrl.js
********************************************** */

app.controller("CategoriasCtrl", function($scope, Categoria, Producto, Archivo) {
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
    /*$http.get("/assets/js/fixtures.json").success(function (data) {
        $scope.categorias = data.Categorias;
        $scope.productos = data.Productos;
        $scope.documentos = data.Documentos;
    });*/

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
});

/* **********************************************
     Begin DashBoardCtrl.js
********************************************** */

/*app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});*/

app.controller('DashBoardCtrl', function($scope, $http, $window, Categoria, Producto, Archivo, User){
    $scope.error = false;
    $scope.error_message = "";
    $scope.buquedas = false;
    $scope.admin = false;
    $scope.current_cat = null;
    $scope.current_prod = null;
    $scope.view_productos = false;
    $scope.view_archivos = false;

    $scope.init = function () {
        $scope.getCategorias();
        $scope.getProductos();
        $scope.getArchivos();
        $scope.get_users();
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

    $scope.lightboxes = {
        "categorias": false,
        "productos": false,
        "archivos": false,
        "busquedas": false,
        "admin": false,
        "downloads": false
    };

    $scope.openLightbox = function(light){
        $scope.lightboxes[light] = true;
    };

    $scope.closeLightbox = function (light) {
        $scope.lightboxes[light] = false;
    };

    $scope.openProductos = function(cat){
        $scope.view_productos = true;
        $scope.current_cat = cat;
        $scope.current_prod = null;
        $scope.view_archivos = false;
    };

    $scope.openArchivos = function(prod){
        $scope.view_archivos = true;
        $scope.current_prod = prod;
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
            $scope.archivos = $data.Archivos;
        })
    };

    $scope.addCategoria = function (params) {
        $scope.categoria = new Categoria(params);

        Categoria.create($scope.categoria, function($data){
            if($data.state == "OK"){
                $scope.categorias.push({"name": $scope.categoria.name});
                $scope.categoria = angular.copy({});
                $scope.closeLightbox('categorias');
            }
        });
    };

    $scope.addProducto = function (params) {
        $scope.producto = new Producto(params);
        $scope.producto.categoria = $scope.current_cat;

        Producto.create($scope.producto, function($data){
            if($data.state == "OK"){
                $scope.productos.push({"name": $scope.producto.name, "categoria": $scope.producto.categoria.name});
                $scope.producto = angular.copy({});
                $scope.closeLightbox('productos');
            }
        });
    };

    $scope.addArchivo = function (params, url) {
        console.log($scope.files);
        $http.post(url, $scope.files,
        {
            headers:{'Content-Type':'multipart/form-data; boundary=123'}
        }).success(function($data){
            console.log($data);
        });
    };

    $scope.upload = function(url){
        var fb = new FormData();
        angular.forEach($scope.files, function (file) {
            fb.append('file', file);
        });

        fb.append('categoria', $scope.current_cat.name);
        fb.append('producto', $scope.current_prod.name);

        $http.post(url, fb,
            {
                transformRequest: angular.identity,
                headers:{'Content-Type':undefined}
            }).success(function($data){
                if($data.state == 'upload'){
                    $scope.archivos.push(
                        {
                            "name": $scope.files[0].name,
                            "categoria": $scope.current_cat.name,
                            "producto": $scope.current_prod.name,
                            "file": "",
                            "size": $scope.files[0].size,
                            "type": $scope.files[0].type
                        });
                    $scope.closeLightbox('archivos');
                    $scope.files = null;
                }
            });
    };

    $scope.filesChanged = function (elm) {
        $scope.files = elm.files;
        console.log($scope.files)
        $scope.$apply();
    }

    $scope.get_users = function(){
        User.get({}, function($data){
            $scope.users = $data.usuarios;
        });
    };

    $scope.buscar = function($data){
        console.log("aqui");
        if($data) {
            $scope.lightboxes['busquedas'] = true;
            $scope.find = $data;
        }
    };

    $scope.cambiarAdmin = function($event, $user){
        var checkbox = $event.target;
        if(checkbox.checked){
            User.update({"username":$user.username, "action":"admin"});
            $user.rol = 'ADMIN';
        }else{
            User.update({"username":$user.username, "action":"user"});
            $user.rol = 'USER';
        }
    };

    $scope.seleccionDocumento = function(documento) {
        $scope.openLightbox('downloads');
        $scope.current_file = documento;
    };

    $scope.deleteC = function(cat){
        Categoria.destroy({id:cat.id}, function($data){
            if($data.state == "OK"){
                delete_item_in_array($scope.categorias, cat.name);
            }else{
               $window.alert($data.msg);
            }
        });
    };

    $scope.deleteP = function(prod){
        Producto.destroy({id:prod.id}, function($data){
            if($data.state == "OK"){
                delete_item_in_array($scope.productos, prod.name);
            }else{
                $window.alert($data.msg);
            }
        });
    };

    $scope.deleteA = function(doc){
        Archivo.destroy({id:doc.id}, function($data){
            if($data.state == "OK"){
                delete_item_in_array($scope.archivos, doc.name);
            }else{
                $window.alert($data.msg);
            }
        });
    };

    function delete_item_in_array(array, item){
        for(var i = 0; i < array.length; i++) {
            if(array[i].name === item) {
               array.splice(i, 1);
            }
        }
    }
});

/* **********************************************
     Begin HomeCtrl.js
********************************************** */

app.controller('HomeCtrl', function($scope){
    $scope.message = "ric";
});

/* **********************************************
     Begin UserCtrl.js
********************************************** */

/*app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});*/

app.controller('UserCtrl', function($scope, $window, User){
    $scope.error = false;
    $scope.error_message = "";

    $scope.nuevo = function(params){
        $scope.user = new User(params);

        User.create(params, function($data){
            console.log($data);
            if($data.state == 'OK'){
                $window.location.href = '/interfaz';
            }else{
                console.log($data);
            }
        })
    }
});

/*
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
});*/


/* **********************************************
     Begin LandingCtrl.js
********************************************** */

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

/* **********************************************
     Begin SessionsCtrl.js
********************************************** */

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

/* **********************************************
     Begin User.js
********************************************** */

app.factory('User', function($resource){
    return $resource('/signup/', { },
        {
            'create':  { method: 'POST', headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}  },
            'show':    { method: 'GET'  },
            'destroy': { method: 'DELETE' },
            'update':  { method: 'PUT'}
        }
    );
})

/* **********************************************
     Begin Session.js
********************************************** */

app.factory('Session', function($resource){
    return $resource('/login/', { },
        {
            'create':  { method: 'POST', headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}  },
            'show':    { method: 'GET'  },
            'destroy': { method: 'DELETE' }
        }
    );
})

/* **********************************************
     Begin Producto.js
********************************************** */

app.factory('Producto', function($resource){
    return $resource('/productos/:id', {id: "@id"},
        {
            'create':  { method: 'POST' },
            'show':    { method: 'GET'  },
            'destroy': { method: 'DELETE' }
        }
    );
})

/* **********************************************
     Begin Categoria.js
********************************************** */

app.factory('Categoria', function($resource){
    return $resource('/categorias/:id', {id: "@id"},
        {
            'create':  { method: 'POST', headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}  },
            'show':    { method: 'GET'  },
            'destroy': { method: 'DELETE' }
        }
    );
})

/* **********************************************
     Begin Archivo.js
********************************************** */

app.factory('Archivo', function($resource){
    return $resource('/archivos/:id', {id: "@id"},
        {
            'create':  { method: 'POST', headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}  },
            'show':    { method: 'GET'  },
            'destroy': { method: 'DELETE' }
        }
    );
})