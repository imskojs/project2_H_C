(function() {
    'use strict';

    angular.module('app')
        .factory('moment', moment);

    moment.$inject = ['$window'];

    function moment($window) {

        return $window.moment;
    }
})();
