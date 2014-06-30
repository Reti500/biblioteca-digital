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