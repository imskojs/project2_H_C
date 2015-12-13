(function() {
  'use strict';
  angular.module('app')
    .directive('ngEnter', ngEnter);

  ngEnter.$inject = ['$window'];

  function ngEnter($window) {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if (event.which === 13) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter);
          });
          $window.cordova.plugins.Keyboard.close();

          event.preventDefault();
        }
      });
    };
  }
})();
