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

app.filter('exactID', [function() {
    return function(items, searchText){
        var filtered = [];
        // searchText = String(searchText).toLowerCase();
        // if(searchText != "") {
            angular.forEach(items, function (item) {
                if (item.categoria_id === searchText)
                    filtered.push(item);
            });
        // };
        return filtered;
    };
}]);