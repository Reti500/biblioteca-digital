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