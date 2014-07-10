app.factory('Producto', function($resource){
    return $resource('/productos/:id', {id: "@id"},
        {
            'create':  { method: 'POST' },
            'show':    { method: 'GET'  },
            'destroy': { method: 'DELETE' }
        }
    );
})