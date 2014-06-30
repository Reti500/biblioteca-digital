(function () {
    this.app = angular.module("bibliotecaTelmex", []).config(function($interpolateProvider){
        console.log("wey");
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    }), this.app.controller("InterfazBiblio", ["$scope", function (o) {
        return o.Lightbox = !1, o.seleccionDocumento = function (t) {
            return o.Lightbox = !0, o.sinBlur = "blur"
        }, o.cerrarLightbox = function () {
            return o.Lightbox = !1, o.sinBlur = ""
        }
    }]), this.app.controller("CategoriasCtr", ["$scope", "$http", function (o, t) {
        return o.productoListado = !0, o.documentosListado = !0, o.idCategoria = "", o.busquedaCategoria = [], o.busquedaCategoria.categoria_id = 0, o.busquedaProducto = [], o.busquedaProducto.producto_id = 0, o.busquedaProducto.categoria_id = 0, t.get("/js/fixtures.json").success(function (t) {
            return o.categorias = t.Categorias, o.productos = t.Productos, o.documentos = t.Documentos
        }), o.seleccionCategoria = function (t) {
            return o.busquedaCategoria.categoria_id = t, o.productoListado = !1, t !== o.idCategoria && (o.documentosListado = !0, console.log("cambio el id")), o.idCategoria = t
        }, o.seleccionProducto = function (t, e) {
            return console.log("la categoria es: " + t + " y el producto es: " + e), o.busquedaProducto.producto_id = e, o.busquedaProducto.categoria_id = t, o.documentosListado = !1
        }
    }])
}).call(this);

//var app = angular.module("App", ["ngResource", "ngRoute"]);
//
//app.config(function($routeProvider) {
//    $routeProvider
//        .when("/home", { templateUrl: "/views/home.html", controller: "HomeCtrl" })
//        .when("/login", { templateUrl: "/views/sessions/login.html", controller: "SessionsCtrl" })
//        .when("/interfaz", { templateUrl: "/views/interfaz/index.html", controller: "InterfazCtrl" })
//});
//
//app.factory("Auth", function() {
//    var session_active = false;
//    var user_data = null;
//
//    this.activate_session = function (user) {
//        session_active = true;
//        user_data = user;
//    };
//
//    this.verify_session = function () {
//        return session_active;
//    };
//
//    return this;
//});
//
//app.run(function($rootScope, $location, Auth, Session){
//    /*$rootScope.$on('$routeChangeStart', function($event, $next, $current){
//        Session.show({}, function ($data) {
//            if($data.state == 'logged' && $data.user){
//                Auth.activate_session($data.user);
//            }else{
//                $location.path('/login')
//            }
//        });
//    });*/
//});