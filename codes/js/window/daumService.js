(function() {
    'use strict';

    angular.module('app')
        .factory('daum', daum);

    daum.$inject = ['$window'];

    function daum($window) {

        if ($window.daum) {
            return $window.daum;
        }
        return;
    }
})();
