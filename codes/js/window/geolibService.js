(function() {
  'use strict';

  angular.module('app')
    .factory('geolib', geolib);

  geolib.$inject = ['$window'];

  function geolib($window) {

    return $window.geolib;

  }
})();
