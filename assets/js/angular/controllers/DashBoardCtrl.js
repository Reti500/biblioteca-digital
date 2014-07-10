/*app = angular.module('bibliotecaTelmex', ['ngResource']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});*/

app.controller('DashBoardCtrl', function($scope, $http, Categoria, Producto, Archivo, User){
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
                $scope.productos.push({"name": $scope.producto.name, "categoria": $scope.producto.categoria});
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
});