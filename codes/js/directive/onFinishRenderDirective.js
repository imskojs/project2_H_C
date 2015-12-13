(function() {
  'use strict';

  angular.module('app')
    .directive('onFinishRender', onFinishRender);

  onFinishRender.$inject = ['$timeout'];

  function onFinishRender($timeout) {
    return {
      restrict: 'A',
      link: link
    };

    function link(scope) {
      if (scope.$last === true) {
        $timeout(function() {
          scope.$broadcast('ngRepeatFinished');
        });
      }
    }
  }
})();
