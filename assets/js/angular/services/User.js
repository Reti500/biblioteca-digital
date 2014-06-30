app.factory('User', function($resource){
    return $resource('/signup/', { },
        {
            'create':  { method: 'POST', headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}  },
            'show':    { method: 'GET'  },
            'destroy': { method: 'DELETE' }
        }
    );
})