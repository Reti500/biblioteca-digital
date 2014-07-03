app.factory('Producto', function($resource){
    return $resource('/productos/', { },
        {
            'create':  { method: 'POST' },
            'show':    { method: 'GET'  },
            'destroy': { method: 'DELETE' }
        }
    );
})