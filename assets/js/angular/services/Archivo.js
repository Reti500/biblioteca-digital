app.factory('Archivo', function($resource){
    return $resource('/archivos/:id', {id: "@id"},
        {
            'create':  { method: 'POST', headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}  },
            'show':    { method: 'GET'  },
            'destroy': { method: 'DELETE' }
        }
    );
})