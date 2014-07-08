/*app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});*/

app.controller('DashBoardCtrl', function($scope, $http, Categoria, Producto, Archivo, User){
    $scope.error = false;
    $scope.error_message = "";
    $scope.buquedas = false;
    $scope.admin = false;

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
        "admin": false
    };

    $scope.openLightbox = function(light){
        $scope.lightboxes[light] = true;
    };

    $scope.closeLightbox = function (light) {
        $scope.lightboxes[light] = false;
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
                $scope.closeLightbox('categorias');
            }
        });
    };

    $scope.addProducto = function (params) {
        $scope.producto = new Producto(params);

        Producto.create($scope.producto, function($data){
            if($data.state == "OK"){
                $scope.productos.push({"name": $scope.producto.name, "categoria": $scope.producto.categoria});
                $scope.closeLightbox('productos');
            }
        });
    };

    $scope.addArchivo = function (params) {
        /*$scope.archivo = new Archivo(params);
        $scope.archivo.file = $scope.files[0];
        $scope.archivo.name = $scope.archivo.file.name;
        $scope.archivo.type = $scope.archivo.file.type;
        $scope.archivo.size = $scope.archivo.file.size;

        Archivo.create($scope.archivo, function($data){
            console.log($data);
        });*/

        $http.post('/upload', $scope.files,
        {
            headers:{'Content-Type':'multipart/form-data; boundary=123'}
        }).success(function($data){
            console.log($data);
        });
    };

    $scope.filesChanged = function (elm) {
        $scope.files = elm.files;
        console.log($scope.files);
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
        $scope.openLightbox('archivo');
        $scope.current_file = documento;
    };
});