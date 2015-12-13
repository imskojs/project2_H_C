(function() {
    'use strict';

    angular.module('app')
        .factory('_', _);

    _.$inject = ['$window'];

    function _($window) {

        if ($window._) {
            return $window._;
        }
        return;
    }
})();
